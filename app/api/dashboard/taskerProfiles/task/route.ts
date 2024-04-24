import connectDatabase from "@/lib/Database";
import { AuthResponseType, PutType } from "@/lib/Enums";
import { PutPayload_General, PutPayload_Status, TaskerProjectTask } from "@/lib/Interfaces";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "@/lib/Types";
import { NextResponse } from "next/server";
import { Document, Collection, UpdateResult } from "mongodb";
import { headers } from "next/headers";

const collectionName = "TaskerProjectsTasks"
let apiResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<any>

interface ProjectDocument extends Document {
    profile_id: string;
    membersList?: string[]; // Assume it's an array of strings or change accordingly
}

interface SelectedProject extends Document {
    tasksList: string[];
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

// Fetch all task from a project OR a particular task
export const GET = async () => {
    const headerList = headers();
    const project_from_id = headerList.get("projectId");
    const singleTaskId = headerList.get("taskId");

    if (!singleTaskId && !project_from_id) {
        apiResponse = {
            status: 400,
            message: "Invalid request - Corrupt task payload 😂😂!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }

    try{
        const client = await connectDatabase();

        if(!client) {
            throw new Error("Failed to connect to Database");
        }

        const db = client.db('taskity');
        const tasksCollection = db.collection(collectionName);

        if (singleTaskId) {
            const task = await tasksCollection.findOne({
                task_id: singleTaskId
            });


            if (!task) throw new Error("task does not exist!");


            apiResponse= {
                status: 200,
                data: task,
                message: "Task found!",
                type: AuthResponseType.NoError
            }


            return NextResponse.json(apiResponse);
        }

        if (project_from_id) {

            const projectCollection: Collection<SelectedProject> = db.collection("TaskerProjects");

            const selectedProject = await projectCollection.findOne({
                project_id: project_from_id
            });

            if(!selectedProject) throw new Error("Can not find this project!");

            const taskList = selectedProject.tasksList;

            const tasksResult = await tasksCollection.find({
                task_id: { $in: taskList }
            }).toArray();

            apiResponse= {
                status: 200,
                data: { tasksResult, project_id: project_from_id },
                message: "Task list found!",
                type: AuthResponseType.NoError
            }

            return NextResponse.json(apiResponse);
        }

    }catch(error){
        apiResponse = {
            status: 400,
            message: `${error}`,
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }
}

// Create a new task
export const POST = async (request: Request) => {
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

export const PUT = async (request: Request) => {
    const { putBody }: { putBody: PutPayload_Status | PutPayload_General } = await request.json();

    const { putType, taskId, payload }= putBody;

    if (!taskId) {
        apiResponse = {
            status: 400,
            message: "Invalid request - No taskId in the payload for PUT 😂😂!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }

    if (!putType) {
        apiResponse = {
            status: 400,
            message: "Invalid request - PUT Type not found in payload for PUT 😂😂!",
            type: AuthResponseType.InvalidError
        }

        return NextResponse.json(apiResponse);
    }
    if (!payload) {
        apiResponse = {
            status: 400,
            message: "Invalid request - PUT Data not found in payload for PUT 😂😂!",
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
        const tasksCollection = db.collection(collectionName);

        let performUpdate: UpdateResult<Document>;

        switch(putType){
            case PutType.STATUS:
                performUpdate = await tasksCollection.updateOne(
                    { task_id: taskId }, { $set: { status: payload } }
                );
                // 
                break;
            case PutType.GENERAL:
                performUpdate = await tasksCollection.updateOne(
                    { task_id: taskId },
                    {$set: { 
                        title: payload.title,
                        shortDesc: payload.shortDesc,
                        desc: payload.desc,
                        priorityLevel: payload.priorityLevel,
                        status: payload.status,
                        assigneeCount: payload.assigneeCount,
                        assigneeList: payload.assigneeList,
                        last_update: payload.last_update,                    
                    }}
                );
                break;
            default: 
                throw new Error("Invalid PUT type");
        }

        if (performUpdate.matchedCount === 0) throw new Error("task does not exist!");

        apiResponse= {
            status: 200,
            data: null,
            message: "Task updated successfully! ✨✔🚀",
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