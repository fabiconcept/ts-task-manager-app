import { PutPayload_General, PutPayload_Status } from "@/lib/Interfaces";
import { fetchProjectTasks, getProfiles, getProjects, getUserData, updateTaskStatus } from "@/lib/functions";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Users Data Operations
export const fetchUserData = createAsyncThunk(
    "userData/fetchUserData",
    async (key: string) => {
        const response = await getUserData(key);
        return response.data;
    }
);

// TaskerProfiles Operations
export const fetchProfiles = createAsyncThunk(
    "taskerProfiles/fetchProfiles",
    async (key: string[]) => {
        const response = await getProfiles(key);
        return response;
    }
);

export const fetchProjects = createAsyncThunk(
    "taskerProjects/fetchProjects",
    async (key: string) => {
        const response = await getProjects(key);
        return response;
    }
);

export const $fetchProjectTasks = createAsyncThunk(
    "tasksList/fetchProjectTasks",
    async (key: string) => {
        const response = await fetchProjectTasks(key);
        return response;
    }
);

export const $updateTaskStatus = createAsyncThunk(
    "tasksList/updateTaskStatus",
    async (payload: PutPayload_Status) => {
        await updateTaskStatus(payload);
        return {
            taskId: payload.taskId,
            newStatus: payload.payload
        };
    }
);