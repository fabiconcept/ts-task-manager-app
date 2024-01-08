import { RootState } from "@/Redux Store";
import { UserDetails } from "@/lib/Interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
    userStatus: "banned" | "good" | "suspended" | "unset",
    userData: UserDetails,
}

const initialState: InitialState = {
    userStatus: "unset",
    userData: {
        displayName: "",
        email: "",
        name: "",
        profileAvatar: "",
        userId: ""
    }
}

const userDataState = createSlice({
    name: "userData",
    initialState,
    reducers: {
        setUserData: (state, payload:PayloadAction<UserDetails>) =>{
            const details = payload.payload;
            state.userData = details
        },
        updateDisplayName: (state, payload:PayloadAction<string>) =>{
            state.userData.displayName = payload.payload;
        },
        updateProfileAvatar: (state, payload:PayloadAction<string>) =>{
            state.userData.profileAvatar = payload.payload;
        },
    }
})

export const { setUserData, updateDisplayName, updateProfileAvatar } = userDataState.actions;
export const UserDataStateSlice = userDataState.reducer;

export const getUserData = (state: RootState) => state.userData;