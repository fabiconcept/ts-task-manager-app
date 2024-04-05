import connectDatabase from '@/lib/Database';
import { AuthResponseType } from '@/lib/Enums';
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from '@/lib/Types';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

let apiResponse : ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<any>

export const GET = async (req: Request, res: Response) => {
    const headerList = headers();
    const key = headerList.get("userKey");


    try {

        if(!key) {
            throw new Error("No connection key string (Client)");
        }

        const client = await connectDatabase();

        if(!client) {
            throw new Error("Failed to connect to Database");
        }

        const db = client.db('taskity');
        const accountsDetailsCollection = db.collection('AccountsDetails');

        const getUserData = await accountsDetailsCollection.findOne({
            userId: key
        });

        if(!getUserData) {
            throw new Error("User not found");
        }

        apiResponse = {
            status: 200,
            type: AuthResponseType.NoError,
            message: "Fetch complete",
            data: getUserData
        }
        return NextResponse.json(apiResponse);
        
    } catch (error) {
        console.error('An error Occured', error);
        apiResponse = {
            status: 400,
            type: AuthResponseType.InvalidError,
            message: `Ewo! no vex`,
        }
        return NextResponse.json(apiResponse);
    }
};

export const PUT = async(req: Request) => {

}