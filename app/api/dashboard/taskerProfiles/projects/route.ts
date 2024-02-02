import connectDatabase from "@/lib/Database";
import { AuthResponseType } from "@/lib/Enums";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "@/lib/Types";
import { NextResponse } from "next/server";

let apiResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<any>

export const POST = async (req: Request, res: Response) => {
    const { owner_id }: {  owner_id: string } = await req.json();

    if (!owner_id || owner_id === "") {
        apiResponse = {
            status: 400, 
            message: "Invalid request - Please provide a Project project_id",
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
        const taskerProjectsCollection = db.collection('TaskerProjects');

        const taskerProjects = await taskerProjectsCollection.find({
            from_id: `${owner_id}`
        }).toArray();

        apiResponse = {
            status: 200,
            data: taskerProjects,
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