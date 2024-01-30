import connectDatabase from "@/lib/Database";
import { AuthResponseType } from "@/lib/Enums";
import { UserAccount } from "@/lib/Interfaces";
import { RequestBody, ResponseWithError, ResponseWithoutError } from "@/lib/Types";
import { generateSalt, hashPassword } from "@/lib/encryption";
import { generateUniqueId, realEscapeString, validateEmail, validateFullName, validatePassword } from "@/lib/utilities";
import { NextResponse } from "next/server";

let response: ResponseWithoutError<{toast: string, token: string}> | ResponseWithError;

export const POST = async (request: Request) => {
    const reqBody: RequestBody = await request.json();
    const { email, name, password } = reqBody;

    if (!validateEmail(email)) {
        response = {
            status: 400,
            type: AuthResponseType.EmailError,
            message: "Invalid Email"
        }
        return NextResponse.json(response);
    }
    
    if (!validateFullName(name)[0]) {
        response = {
            status: 400,
            type: AuthResponseType.NameError,
            message: "Invalid name"
        }
        return NextResponse.json(response);
    }
    
    if (!validatePassword(password)[0]) {
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

        const UserId = generateUniqueId();
        const cleanEmail = realEscapeString(email);
        const cleanName = realEscapeString(name);
        const userSalt = generateSalt();
        const loginAuthKey = generateSalt();
        const loginExpTime = (new Date()).getTime() + (60 * 60 * 1000);

        const authentication = {
            key: loginAuthKey,
            exp: loginExpTime
        }

        const hashedPassword = hashPassword(password, userSalt);

        const payload = {
            userId: UserId,
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            userSalt: userSalt,
            authentication: authentication
        } satisfies UserAccount;

        const splitName = payload.name.split(" ");

        // check if email exist
        const emailExist = await accountsCollection.findOne({email: payload.email});

        if (emailExist) {
            response = {
                status: 400,
                type: AuthResponseType.EmailError,
                message: "User already exist!"
            }
            return NextResponse.json(response);
        }

        // Create user account
        await accountsCollection.insertOne(payload);

        // Create user account details
        await accountsDetailsCollection.insertOne({
            userId: payload.userId,
            displayName: `${splitName[0][0]}${splitName[1][0]}`,
            profileAvatar: "",
            name: payload.name,
            email: payload.email,
        });
        
        response = { 
            status: 200, 
            type: AuthResponseType.NoError,
            message: { 
                toast: "Account successfully created ✨!",
                token: `${UserId} ${authentication}`
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