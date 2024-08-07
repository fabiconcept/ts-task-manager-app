import { BrevoEmailClient } from "@/lib/Classes";
import connectDatabase from "@/lib/Database";
import { createAccountEmail } from "@/lib/Email template";
import { AuthResponseType } from "@/lib/Enums";
import { TaskerProfile, UserAccount, UserAccountDetails } from "@/lib/Interfaces";
import { RequestBody, ResponseWithError, ResponseWithoutError } from "@/lib/Types";
import { generateSalt, hashPassword } from "@/lib/encryption";
import { generateUniqueId, realEscapeString, validateEmail, validateFullName, validatePassword } from "@/lib/utilities";
import { NextResponse } from "next/server";

let response: ResponseWithoutError<{toast: string, token: string}> | ResponseWithError;

export const POST = async (request: Request) => {
    const reqBody: RequestBody = await request.json();
    const { email, name, password, type, avatar } = reqBody;

    if (!validateEmail(email)) {
        response = {
            status: 400,
            type: AuthResponseType.EmailError,
            message: "Invalid Email"
        }
        return NextResponse.json(response);
    }
    
    if ((!type || type === "normal") && !validateFullName(name)[0]) {
        response = {
            status: 400,
            type: AuthResponseType.NameError,
            message: "Invalid name"
        }
        return NextResponse.json(response);
    }
    
    if ((!type || type === "normal") && !validatePassword(password)[0]) {
        response = {
            status: 400,
            type: AuthResponseType.PasswordError,
            message: "Invalid password format"
        }
        return NextResponse.json(response);
    }

    try {
        const client = await connectDatabase();

        if(!client) {
            throw new Error("Failed to connect to Database");
        }

        const db = client.db("taskity");

        const accountsCollection = db.collection("Accounts");
        const accountsDetailsCollection = db.collection("AccountsDetails");
        const TaskerProfileCollection = db.collection("TaskerProfiles");

        const UserId = generateUniqueId();
        const cleanEmail = realEscapeString(email);
        const cleanName = realEscapeString(name);
        const userSalt = generateSalt();
        const loginAuthKey = generateSalt();
        const loginExpTime = (new Date()).getTime() + (60 * 60 * 1000);

        const myTaskerProfile:TaskerProfile = {
            profile_id: generateUniqueId(),
            name: cleanName,
            bio: "",
            avatar: avatar ?? "",
            owner: UserId,
            ownerEmail: cleanEmail,
            team: [
                { 
                    user_id: UserId, 
                    type: "owner", 
                    status: "active",
                    joined_on: (new Date()).toDateString(),
                    email: cleanEmail
                }
            ],
            invitedTeam: [],
            invitedTeamCount: 0,
            teamCount: 1,
            projectsCount: 0,
            updated_on: (new Date()).toDateString(),
            created_on: (new Date()).toDateString(),
        }

        const authentication = {
            key: loginAuthKey,
            exp: loginExpTime
        }

        let payload: UserAccount;

        if (type != "social") {
            const hashedPassword = hashPassword(password, userSalt);

            payload = {
                userId: UserId,
                name: cleanName,
                email: cleanEmail,
                password: hashedPassword,
                userSalt: userSalt,
                authentication: authentication,
            };


            // check if email exist
            const emailExist = await accountsCollection.findOne({ email: payload.email });

            if (emailExist) {
                response = {
                    status: 400,
                    type: AuthResponseType.EmailError,
                    message: "User already exist!"
                }
                return NextResponse.json(response);
            }
        } else {
            payload = {
                userId: UserId,
                name: cleanName,
                email: cleanEmail,
                password: "",
                userSalt: userSalt,
                authentication: authentication,
            };
        }


        const splitName = payload.name.split(" ");

        // Create user account
        await accountsCollection.insertOne(payload);
        await TaskerProfileCollection.insertOne(myTaskerProfile);

        // Create user account details
        const accountsDetailsPayload: UserAccountDetails = {
            userId: payload.userId,
            displayName: `${splitName[0][0]}${splitName[1][0]}`,
            profileAvatar: avatar ?? "",
            name: payload.name,
            email: payload.email,
            defaultProject: myTaskerProfile.profile_id,
            projects: [
                {
                    profile_id: myTaskerProfile.profile_id, 
                    last_used: (new Date()).toDateString(),
                }
            ],
            created_on: (new Date).toDateString(),
        }
        await accountsDetailsCollection.insertOne(accountsDetailsPayload);

        const brevoClient = new BrevoEmailClient();

        const emailData = {
            receiptName: payload.name,
            receiptEmail: payload.email,
            subject: "Welcome to Taskify - Your Task Management Companion 🚀",
            emailBody: createAccountEmail(payload.name),
        }

        brevoClient.sendEmail(
            emailData.receiptName,
            emailData.receiptEmail,
            emailData.subject,
            emailData.emailBody,
        )
        .then(response => {
            if (response.ok) {
                console.log('Email sent successfully!');
            } else {
                console.error('Error sending email:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error sending email:', error);
        });
        
        response = { 
            status: 200, 
            type: AuthResponseType.NoError,
            message: { 
                toast: "Account successfully created ✨!",
                token: `${UserId} ${authentication.key}`
            } 
        }
        
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ 
            status: 400, 
            type: AuthResponseType.UnknownError,
            message: `An error occurred! ${error}` 
        });
    }
}