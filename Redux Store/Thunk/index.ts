import { getUserData } from "@/lib/functions";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserData = createAsyncThunk(
    "userData/fetchUserData",
    async (key: string) => {
        const response = await getUserData(key);
        return response.data;
    }
)