import { NextResponse } from 'next/server';
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from '@/lib/Types';
import { AuthResponseType } from '@/lib/Enums';
import connectDatabase from '@/lib/Database';
import { isValidURL, realEscapeString, validateText } from '@/lib/utilities';

let apiResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<any>;
const collection = "TaskerProfiles";


export const POST = async (req: Request, res: Response) => {
    const { key }: { key: string[] } = await req.json();

    if (key.length === 0) {
        apiResponse = {
            status: 400, 
            message: "Invalid request - Please provide a valid key",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }

    try {
        const client = await connectDatabase();

        if(!client) {
            throw new Error("Failed to connect to Database");
        }

        const db = client.db('taskity');
        const taskerProfilesCollection = db.collection(collection);
        
        const taskerProfiles = await taskerProfilesCollection.find({
            profile_id: { $in: key }
        }).toArray();


        apiResponse = {
            status: 200,
            data: taskerProfiles,
            message: `Found`,
            type: AuthResponseType.NoError
        }

        return NextResponse.json(apiResponse);
    } catch (error) {
        apiResponse = {
            status: 400, 
            message: `Invalid request - ${error}`,
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }
}

export const PUT = async(req: Request) => {
    const { payload }: { payload: {profile_id: string, name: string, avatar: string, bio: string} } = await req.json();
    
    if (!payload) {
        apiResponse = {
            status: 400,
            message: "Missing payload!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }

    if (!payload.profile_id) {
        apiResponse = {
            status: 400,
            message: "Missing Tasker profile id!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }
    
    if (!payload.name) {
        apiResponse = {
            status: 400,
            message: "Tasker profile name can not be empty!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }

    if (!validateText(payload.name)) {
        apiResponse = {
            status: 400,
            message: "Invalid character in tasker profile name!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }
    
    if ((payload.name).length > 50) {
        apiResponse = {
            status: 400,
            message: "Tasker profile name is too long!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }

    if ((payload.bio).length > 300) {
        apiResponse = {
            status: 400,
            message: "Tasker profile bio is too long!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }
    
    if (payload.avatar && !isValidURL(payload.avatar)) {
        apiResponse = {
            status: 400,
            message: "Invalid avatar url for Tasker profile avatar!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }

    try {
        const client = await connectDatabase();

        if(!client) {
            throw new Error("Failed to connect to Database");
        }

        const db = client.db('taskity');
        const taskerProfilesCollection = db.collection(collection);

        const cleanPayload = {
            profile_id: realEscapeString(payload.profile_id),
            name: realEscapeString(payload.name),
            bio: realEscapeString(payload.bio),
            avatar: realEscapeString(payload.avatar),
        }

        const validateProfileId = await taskerProfilesCollection.findOne({profile_id: cleanPayload.profile_id})

        if (!validateProfileId) {
            throw new Error(`${payload.profile_id} is an invalid profile id`);
        }

        await taskerProfilesCollection.updateOne(
            {profile_id: cleanPayload.profile_id},
            {
                $set: {
                    name: cleanPayload.name, 
                    bio: cleanPayload.bio, 
                    avatar: cleanPayload.avatar
                }
            }
        );

        apiResponse = {
            status: 200, 
            data: null,
            message: `Update to ${cleanPayload.profile_id} successful`,
            type: AuthResponseType.NoError
        }

        return NextResponse.json(apiResponse);
    } catch (error) {
        apiResponse = {
            status: 400, 
            message: `Invalid request - ${error}`,
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }

    return NextResponse.json(payload);
}