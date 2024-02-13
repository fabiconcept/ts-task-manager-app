import { RootState } from "@/Redux Store";
import { loadingState } from "@/lib/Enums";
import { UserAccountDetails } from "@/lib/Interfaces";
import { TeamMember } from "@/lib/Types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
    loading: loadingState,
    error: string,
    taskerTeam: TeamMember[],
    owner: string;
    team: []
}

type teamStateWithData = {
    loading: loadingState.SUCCESS,
    error: string,
    taskerTeam: TeamMember[],
    owner: string;
    team: UserAccountDetails[]
}

const initialState: InitialState | teamStateWithData = {
    loading: loadingState.IDLE,
    owner: "",
    error: "",
    taskerTeam: [],
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
        },
        updateTaskerTeam: (state, action: PayloadAction<{arr: TeamMember[], id: string}>) => {
            state.taskerTeam = action.payload.arr;
            state.owner = action.payload.id;
        }
    },
    extraReducers: (builder) => { 
        
    }
});

export const { cleanTeamMain, updateTaskerTeam } = teamMainState.actions;

export const echoTeamFromActiveProfile = (state: RootState) => state.teamMain.taskerTeam;
export const echoOwnerOfActiveProfile = (state: RootState) => state.teamMain.owner;

export const teamMainStateSlice = teamMainState.reducer;