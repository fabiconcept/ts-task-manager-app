import { configureStore } from "@reduxjs/toolkit";
import { UserDataStateSlice } from "./Slices/user data";
import { TaskerProfilesStateSlice } from "./Slices/profiles";

const store = configureStore({
    reducer: {
        userData: UserDataStateSlice,
        taskerProfiles: TaskerProfilesStateSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;