import { configureStore } from "@reduxjs/toolkit";
import { UserDataStateSlice } from "./Slices/user data";
import { TaskerProfilesStateSlice } from "./Slices/profiles";
import { projectsListStateSlice } from "./Slices/profiles/projects";
import { teamMainStateSlice } from "./Slices/profiles/team";
import { popUpSlice } from "./Slices/Popup Slice";
import { $tasksListSlice } from "./Slices/profiles/projects/tasks";

const store = configureStore({
    reducer: {
        userData: UserDataStateSlice,
        taskerProfiles: TaskerProfilesStateSlice,
        projectsList: projectsListStateSlice,
        teamMain: teamMainStateSlice,
        popUp: popUpSlice,
        tasksList: $tasksListSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;