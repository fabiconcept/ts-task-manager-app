import { NextResponse } from 'next/server';
import { AuthResponseType } from '@/lib/Enums';
import connectDatabase from '@/lib/Database';
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "@/lib/Types";
import { headers } from 'next/headers';
import { TaskerInvite, TaskerProfile, UserAccount } from '@/lib/Interfaces';
import { generateUniqueId, getTomorrowDateFormatted, realEscapeString, validateEmail } from '@/lib/utilities';
import { BrevoEmailClient } from '@/lib/Classes';
import { inviteEmail } from '@/lib/Email template';

let apiResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<any>

function isTaskerProfile(profile: any): profile is TaskerProfile {
    return (profile as TaskerProfile).profile_id !== undefined;
}
function isUserAccount(profile: any): profile is UserAccount {
    return (profile as UserAccount).userId !== undefined;
}

export const GET = async()=>{
    const headerList = headers();
    const userId = headerList.get("userId");
    const searchQuery = headerList.get("searchQuery");

    if (!userId) {
        apiResponse = {
            status: 400,
            message: "Invalid request - User id not found",
            type: AuthResponseType.InvalidError
        }
        
        return NextResponse.json(apiResponse);
    }

    apiResponse = {
        status: 200,
        message: "User found",
        data: userId,
        type: AuthResponseType.NoError
    }
    return NextResponse.json(apiResponse);
}

export const POST = async(request: Request, response: Response)=>{
    const { email, profile_id }: { email: string, profile_id: string } = await request.json();

    if (!email) {
        apiResponse = {
            status: 400,
            message: "Invalid request - Who do you want to invite? 🙄",
            type: AuthResponseType.InvalidError
        }
        
        return NextResponse.json(apiResponse);
    }

    if (!validateEmail(email)) {
        apiResponse = {
            status: 400,
            message: "Invalid request - Invalid Email address provided? 🙄",
            type: AuthResponseType.InvalidError
        }
        
        return NextResponse.json(apiResponse);
    }
    
    if (!profile_id) {
        apiResponse = {
            status: 400,
            message: "Invalid request - Profile Id not provided? 🙄",
            type: AuthResponseType.InvalidError
        }
        
        return NextResponse.json(apiResponse);
    }

    const cleanInput = {
        email: realEscapeString(email),
        profile_id: realEscapeString(profile_id),
    }
    
    try {
        const client = await connectDatabase();
        const brevoClient = new BrevoEmailClient();

        if(!client) {
            throw new Error("Failed to connect to Database");
        }

        const db = client.db('taskity');
        const collection = db.collection("TaskerProfiles");
        const collectionUsers = db.collection("Accounts");
        const collectionInviteCode = db.collection("TaskerInvite");

        const taskerProfile = await collection.findOne({
            profile_id: cleanInput.profile_id
        });

        if (!taskerProfile) {
            const errorMessage = "Profile not found!"
            throw new Error(errorMessage);
        }

        const userExist = await collectionUsers.findOne({
            email: cleanInput.email
        });

        const inviteData: TaskerInvite = {
            code: generateUniqueId(),
            invited_to: cleanInput.profile_id,
            invited_email: cleanInput.email,
            exp_date: getTomorrowDateFormatted(),
        }

        let emailData;


        if (isTaskerProfile(taskerProfile)) {
            if (taskerProfile.invitedTeam && taskerProfile.invitedTeam.length > 0 && taskerProfile.invitedTeam.find((invitee)=> invitee === email)) {
                throw new Error("You've already invited Bro! 💀");
            }

            if (taskerProfile.team && taskerProfile.team.length > 0 && taskerProfile.team.find((TeamMember)=> TeamMember.email === email)) {
                throw new Error("User is already a team memeber! 💀");
            }
            
            if (taskerProfile.ownerEmail === email) {
                throw new Error("You can not invite the Admin! 💀");
            }

            await collection.updateOne(
                { profile_id: cleanInput.profile_id }, {
                $push: { invitedTeam: cleanInput.email },
                $inc: { invitedTeamCount: 1 }
            });

            await collectionInviteCode.insertOne(inviteData);

            const profileName = taskerProfile.name;

            if (userExist && isUserAccount(userExist)) {
                const inviteeName = userExist.name;
                emailData = {
                    receiptName: inviteeName,
                    receiptEmail: cleanInput.email,
                    subject: `Invitation to Collaborate on Taskify with ${profileName}`,
                    emailBody: inviteEmail(profileName, inviteeName)
                }
            }else {
                emailData = {
                    receiptName: "Comrade",
                    receiptEmail: cleanInput.email,
                    subject: `Invitation to Collaborate on Taskify with ${profileName}`,
                    emailBody: inviteEmail(profileName)
                }
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
        }else {
            throw new Error("An unknown error occured!");
        }

        apiResponse = { 
            status: 200, 
            type: AuthResponseType.NoError,
            message: `Invitation sent to ${emailData.receiptName}`,
            data: null
        }
        
        return NextResponse.json(apiResponse);
    } catch (error) {
        return NextResponse.json({ 
            status: 400, 
            type: AuthResponseType.UnknownError,
            message: `An error occurred! ${error}` 
        });
    }
}