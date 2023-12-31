import { configureStore } from "@reduxjs/toolkit";
import { UserDataStateSlice } from "./Slices/user data";

const store = configureStore({
    reducer: {
        userData: UserDataStateSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;