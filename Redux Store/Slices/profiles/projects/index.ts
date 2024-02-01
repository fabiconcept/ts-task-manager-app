import { RootState } from "@/Redux Store";
import { fetchProjects } from "@/Redux Store/Thunk";
import { loadingState } from "@/lib/Enums";
import { TaskerProject } from "@/lib/Interfaces";
import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
    loading: loadingState,
    errorMsg: string,
    response: TaskerProject[];
}

const initialState: InitialState = {
    loading: loadingState.IDLE,
    errorMsg: "",
    response: [],
}

const projectsListState = createSlice({
    name: "projectList",
    initialState,
    reducers: {
        cleanResponse: (state) => {
            state.loading = loadingState.IDLE;
            state.errorMsg = "";
            state.response = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjects.pending, (state)=>{
            state.loading = loadingState.PENDING;
        });

        builder.addCase(fetchProjects.rejected, (state) => { 
            state.loading = loadingState.FAILED
        });

        builder.addCase(fetchProjects.fulfilled, (state, action)=>{
            const payload = action.payload;
            const { response, message, resultProjects } = payload;

            if (!response) {
                state.loading = loadingState.FAILED;
                state.errorMsg = message;
                return;
            }

            state.loading = loadingState.SUCCESS;
            state.errorMsg = "";
            state.response = resultProjects;
        });
    }
});

export const { cleanResponse } = projectsListState.actions;

export const projectsListStateSlice = projectsListState.reducer;

export const echoProjectListLoading = (state: RootState) => state.projectsList.loading;
export const echoProjectListError = (state: RootState) => state.projectsList.errorMsg;
export const echoProjectListResponse = (state: RootState) => state.projectsList.response; 