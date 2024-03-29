import connectDatabase from '@/lib/Database';
import { AuthResponseType } from '@/lib/Enums';
import { TaskerProject } from '@/lib/Interfaces';
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from '@/lib/Types';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

let apiResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<any>
const collectionName = "TaskerProjects";

export const GET = async (req: Request) => {
    const headerList = headers();
    const project_key = headerList.get("project_key");

    if (!project_key) {
        apiResponse = {
            status: 400,
            message: "Invalid request - No project id!",
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
        const collection = db.collection(collectionName);

        const taskerProject = await collection.findOne({
            project_id: `${project_key}`
        });


        if (!taskerProject) {
            throw new Error("Project does not exist!");
        }

        apiResponse = {
            status: 200,
            data: taskerProject,
            message: "Project found.",
            type: AuthResponseType.NoError
        }
        
        return NextResponse.json(apiResponse);

    } catch (error) {
        apiResponse = {
            status: 400,
            message: `${error}`,
            type: AuthResponseType.InvalidError
        }
        return NextResponse.json(apiResponse);
    }
}

export const POST = async (req: Request, res: Response) => {
    const { payload }: {payload: TaskerProject} = await req.json();

    if (!payload) {
        apiResponse = {
            status: 400,
            message: "Invalid request - Corrupt payload 😂😂!",
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
        const collection = db.collection(collectionName);
        const taskerProfilesCollection = db.collection('TaskerProfiles');

        await collection.insertOne(payload);
        await taskerProfilesCollection.updateOne(
            {profile_id: payload.from_id},
            {$inc: {projectsCount: 1}}
        );

        apiResponse = {
            status: 200,
            data: null,
            message: "You've successfully created a new project ✨!",
            type: AuthResponseType.NoError
        }
        
        return NextResponse.json(apiResponse);
    } catch (error) {
        apiResponse = {
            status: 400,
            message: `${error}`,
            type: AuthResponseType.InvalidError
        }
        
        return NextResponse.json(apiResponse);
    }
}