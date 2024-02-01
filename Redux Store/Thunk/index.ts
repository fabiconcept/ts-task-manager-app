import { getProfiles, getProjects, getUserData } from "@/lib/functions";
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
    async (key: string[]) => {
        const response = await getProjects(key);
        return response;
    }
);
