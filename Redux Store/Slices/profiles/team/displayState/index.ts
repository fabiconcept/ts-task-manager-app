import { RootState } from "@/Redux Store";
import { SortBy, ViewType } from "@/lib/Enums";
import { UserAccountDetails } from "@/lib/Interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
    viewType: ViewType,
    sortBy: SortBy,
    displayList: UserAccountDetails[],
}

const initialState: InitialState = {
    viewType: ViewType.BOX,
    sortBy: SortBy.TYPE,
    displayList: [],
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