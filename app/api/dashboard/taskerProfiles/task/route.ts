import connectDatabase from "@/lib/Database";
import { AuthResponseType } from "@/lib/Enums";
import { TaskerProjectTask } from "@/lib/Interfaces";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "@/lib/Types";
import { NextResponse } from "next/server";

const collectionName = "TaskerProjectsTasks"
let apiResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<any>

export const GET = async () => {
}

// Create a new task
export const POST = async (request: Request, response: Response) => {
    const { payload }: { payload: TaskerProjectTask } = await request.json();

    if (!payload) {
        apiResponse = {
            status: 400,
            message: "Invalid request - Corrupt task payload 😂😂!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }
    
    if (!payload.from_id || !payload.task_id || !payload.title) {
        apiResponse = {
            status: 400,
            message: "Invalid request - Invalid task format!",
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
        const taskerProfilesProjectCollection = db.collection('TaskerProjects');

        await taskerProfilesProjectCollection.updateOne(
            {profile_id: payload.from_id},
            {
                $inc: {tasksCount: 1}, 
                $push: {tasksList: payload.task_id}
            }
        );

        await collection.insertOne(payload);

        apiResponse = {
            status: 200,
            data: null,
            message: "You've successfully created a new Task ✨!",
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