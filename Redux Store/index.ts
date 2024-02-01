import { configureStore } from "@reduxjs/toolkit";
import { UserDataStateSlice } from "./Slices/user data";
import { TaskerProfilesStateSlice } from "./Slices/profiles";
import { projectsListStateSlice } from "./Slices/profiles/projects";

const store = configureStore({
    reducer: {
        userData: UserDataStateSlice,
        taskerProfiles: TaskerProfilesStateSlice,
        projectsList: projectsListStateSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;