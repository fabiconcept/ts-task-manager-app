import { NextResponse } from 'next/server';
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from '@/lib/Types';
import { AuthResponseType } from '@/lib/Enums';
import connectDatabase from '@/lib/Database';

let apiResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<any>


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
        const taskerProfilesCollection = db.collection('TaskerProfiles');
        
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