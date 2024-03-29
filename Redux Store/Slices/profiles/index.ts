import { RootState } from "@/Redux Store";
import { fetchProfiles } from "@/Redux Store/Thunk";
import { loadingState } from "@/lib/Enums";
import { TaskerProfile } from "@/lib/Interfaces";
import { CompanyTag } from "@/lib/Types/dashboard";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
    loading: loadingState,
    error: string,
    response: {
        profiles: TaskerProfile[],
        tags: CompanyTag[]
    },
    activeId: string
}

const initialState: InitialState = {
    loading: loadingState.IDLE,
    error: "",
    response: {
        profiles: [],
        tags: []
    },
    activeId: "",
}

const TaskerProfilesState = createSlice({
    name: "taskerProfiles",
    initialState,
    reducers: {
        cleanResponse: (state) =>{
            state.response = {
                profiles: [],
                tags: []
            };
            state.loading = loadingState.IDLE;
            state.error = "";
        },
        switchProfile: (state, action: PayloadAction<string>) => {
            state.activeId = action.payload;
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(fetchProfiles.pending, (state)=>{
            state.loading = loadingState.PENDING
            state.error = ""
        });

        builder.addCase(fetchProfiles.rejected,  (state)=> {
            state.loading = loadingState.FAILED;
            state.error = "Failed to Fetch Tasker Profiles";
        });

        builder.addCase(fetchProfiles.fulfilled, (state, action)=>{
            const payload = action.payload;
            const status = payload.response;

            if (!status) {
                state.loading = loadingState.FAILED;
                state.error = payload.message;
                return;
            }

            state.loading = loadingState.SUCCESS;
            state.error = "";
            state.response.profiles = payload.resultProfiles;
            state.response.tags = [...payload.resultTag];
            state.activeId = payload.resultTag[0].id;

        })
    }
});

export const { cleanResponse, switchProfile } = TaskerProfilesState.actions;
export const TaskerProfilesStateSlice = TaskerProfilesState.reducer;

export const echoTaskerProfilesLoading = (state: RootState) => state.taskerProfiles.loading; 
export const echoTaskerProfilesError = (state: RootState) => state.taskerProfiles.error; 
export const echoTaskerProfilesResponse = (state: RootState) => state.taskerProfiles.response; 
export const echoTaskerProfilesActiveId = (state: RootState) => state.taskerProfiles.activeId; 