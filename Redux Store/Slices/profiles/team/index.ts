import { loadingState } from "@/lib/Enums";
import { UserAccountDetails } from "@/lib/Interfaces";
import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
    loading: loadingState,
    error: string,
    team: []
}

type teamStateWithData = {
    loading: loadingState.SUCCESS,
    error: string,
    team: UserAccountDetails[]
}

const initialState: InitialState | teamStateWithData = {
    loading: loadingState.IDLE,
    error: "",
    team: []
}

const teamMainState = createSlice({
    name: "teamMainState",
    initialState,
    reducers: {
        cleanTeamMain: (state) => {
            if (state.loading === loadingState.SUCCESS) {
                state.team = [];
            }
            state.loading = loadingState.IDLE;
            state.error = "";
        }
    },
    extraReducers: (builder) => { 
        
    }
});