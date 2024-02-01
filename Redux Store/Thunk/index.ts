import { getProfiles, getUserData } from "@/lib/functions";
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


