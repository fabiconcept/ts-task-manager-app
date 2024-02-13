import { RootState } from "@/Redux Store";
import { SortBy, ViewType } from "@/lib/Enums";
import { UserAccountDetails } from "@/lib/Interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const dummyUserAccounts: UserAccountDetails[] = [
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
    viewType: ViewType,
    sortBy: SortBy,
    displayList: UserAccountDetails[],
}

const initialState: InitialState = {
    viewType: ViewType.BOX,
    sortBy: SortBy.TYPE,
    displayList: dummyUserAccounts, 
}

const displayTeamState = createSlice({
    name: "displayTeamState",
    initialState,
    reducers: {
        cleanDisplayTeamMain: (state) => {
            state.viewType = ViewType.BOX;
            state.sortBy = SortBy.TYPE;
            state.displayList = [];
        },
        updateDisplayList: (state, action: PayloadAction<UserAccountDetails[]>) => {
            state.displayList = action.payload;
        },
        updateSortBy: (state, action: PayloadAction<SortBy>) => {
            state.sortBy = action.payload;
        },
        updateViewType: (state, action: PayloadAction<ViewType>) => {
            state.viewType = action.payload;
        }
    }
});

export const displayTeamStateSlice = displayTeamState.reducer;

export const { cleanDisplayTeamMain, updateDisplayList, updateSortBy, updateViewType } = displayTeamState.actions;

export const echoDisplayList = (state:RootState) => state.teamDisplayList.displayList;
export const echoSortBy = (state:RootState) => state.teamDisplayList.sortBy;
export const echoViewType = (state:RootState) => state.teamDisplayList.viewType;