import connectDatabase from "@/lib/Database";
import { AuthResponseType } from "@/lib/Enums";
import { TaskerProjectTask } from "@/lib/Interfaces";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "@/lib/Types";
import { NextResponse } from "next/server";
import { Document, Collection } from "mongodb";

const collectionName = "TaskerProjectsTasks"
let apiResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<any>

interface ProjectDocument extends Document {
    profile_id: string;
    membersList?: string[]; // Assume it's an array of strings or change accordingly
}

function findNonMembers(membersList: string[] | undefined, assigneeList: string[]): string[] {
    if(!membersList) return assigneeList;
    
    const membersSet = new Set(membersList); // Convert membersList to a Set for fast lookup
    const nonMembers: string[] = [];

    // Iterate through assigneeList and collect items not in membersSet
    assigneeList.forEach((assignee) => {
        if (!membersSet.has(assignee)) {
            nonMembers.push(assignee); // If it's not in membersSet, add to nonMembers
        }
    });

    return nonMembers;
}

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
        const taskerProfilesProjectCollection: Collection<ProjectDocument> = db.collection('TaskerProjects');

        const getProject = await taskerProfilesProjectCollection.findOne({
            project_id: payload.from_id
        });

        if (!getProject) throw new Error("An unexpected error occured!");

        const membersList = getProject.membersList;

        const nonMemebers = findNonMembers(membersList, payload.assigneeList);

        await taskerProfilesProjectCollection.updateOne(
            {project_id: payload.from_id},
            {
                $inc: {tasksCount: 1, membersCount: nonMemebers.length}, 
                $push: {tasksList: payload.task_id},
                $addToSet: {
                    membersList: {
                        $each : nonMemebers
                    }
                }
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