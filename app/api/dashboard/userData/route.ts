import connectDatabase from '@/lib/Database';
import { AuthResponseType } from '@/lib/Enums';
import { NextResponse } from 'next/server';


export const POST = async (req: Request, res: Response) => {
    const { key }: { key: string } = await req.json();

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

        const testPip = accountsDetailsCollection.find()

        const getUserData = await accountsDetailsCollection.findOne({
            userId: key
        });

        if(!getUserData) {
            throw new Error("User not found");
        }

        return NextResponse.json({
            status: 200,
            type: 0,
            message: getUserData,
        });
        
    } catch (error) {
        console.error('An error Occured', error);
        return NextResponse.json({
            status: 400,
            type: AuthResponseType.InvalidError,
            message: `Ewo! no vex`,
        });
    }
};
