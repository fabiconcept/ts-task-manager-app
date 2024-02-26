import { RootState } from "@/Redux Store";
import { loadingState } from "@/lib/Enums";
import { UserAccountDetails } from "@/lib/Interfaces";
import { TeamMember } from "@/lib/Types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


const  dummyUserAccounts: UserAccountDetails[] = [
    {
        userId: "cnbbaknei9l1706619434965",
        displayName: "Favour",
        profileAvatar: "",
        name: "Favour Tochukwu Ajokubi",
        email: "favour@example.com",
        projects: [],
        defaultProject: "",
        created_on: "2024-02-13",
    },
    {
        userId: "2",
        displayName: "John",
        profileAvatar: "",
        name: "John Doe",
        email: "john@example.com",
        projects: [],
        defaultProject: "",
        created_on: "2024-02-14",
    },
    {
        userId: "3",
        displayName: "Alice",
        profileAvatar: "",
        name: "Alice Johnson",
        email: "alice@example.com",
        projects: [],
        defaultProject: "",
        created_on: "2024-02-15",
    },
    {
        userId: "4",
        displayName: "Bob",
        profileAvatar: "",
        name: "Bob Smith",
        email: "bob@example.com",
        projects: [],
        defaultProject: "",
        created_on: "2024-02-16",
    },
    {
        userId: "5",
        displayName: "Grace",
        profileAvatar: "",
        name: "Grace Williams",
        email: "grace@example.com",
        projects: [],
        defaultProject: "",
        created_on: "2024-02-17",
    },
    {
        userId: "6",
        displayName: "Daniel",
        profileAvatar: "",
        name: "Daniel Brown",
        email: "daniel@example.com",
        projects: [],
        defaultProject: "",
        created_on: "2024-02-18",
    },
    {
        userId: "7",
        displayName: "Ella",
        profileAvatar: "",
        name: "Ella Johnson",
        email: "ella@example.com",
        projects: [],
        defaultProject: "",
        created_on: "2024-02-19",
    },
    {
        userId: "8",
        displayName: "Chris",
        profileAvatar: "",
        name: "Chris White",
        email: "chris@example.com",
        projects: [],
        defaultProject: "",
        created_on: "2024-02-20",
    },
    {
        userId: "9",
        displayName: "Sophia",
        profileAvatar: "",
        name: "Sophia Davis",
        email: "sophia@example.com",
        projects: [],
        defaultProject: "",
        created_on: "2024-02-21",
    },
    {
        userId: "10",
        displayName: "David",
        profileAvatar: "",
        name: "David Johnson",
        email: "david@example.com",
        projects: [],
        defaultProject: "",
        created_on: "2024-02-22",
    },
];

type InitialState = {
    loading: loadingState,
    error: string,
    taskerTeam: TeamMember[],
    owner: string;
    team: UserAccountDetails[]
}

type teamStateWithData = {
    loading: loadingState.SUCCESS,
    error: string,
    taskerTeam: TeamMember[],
    owner: string;
    team: UserAccountDetails[]
}

const initialState: InitialState | teamStateWithData = {
    loading: loadingState.PENDING,
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
export const echoTeamFromActiveProfileLoadingState = (state: RootState) => state.teamMain.loading;
export const echoTeamFromActiveProfileErrorState = (state: RootState) => state.teamMain.error;
export const echoDisplayList = (state:RootState) => state.teamMain.team;
export const echoOwnerOfActiveProfile = (state: RootState) => state.teamMain.owner;

export const teamMainStateSlice = teamMainState.reducer;