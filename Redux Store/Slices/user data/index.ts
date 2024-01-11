import { RootState } from "@/Redux Store";
import { fetchUserData } from "@/Redux Store/Thunk";
import { loadingState } from "@/lib/Enums";
import { UserDetails } from "@/lib/Interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ResponseTpe = {
    userStatus: "banned" | "good" | "suspended" | "unset",
    userData: UserDetails,
}

type InitialState = {
    loading: loadingState,
    error: string,
    response: ResponseTpe
}

const initialState: InitialState = {
    loading: loadingState.IDLE,
    error: "",
    response: {
        userStatus: "unset",
        userData: {
            displayName: "",
            email: "",
            name: "",
            profileAvatar: "",
            userId: ""
        }
    }
}

const userDataState = createSlice({
    name: "userData",
    initialState,
    reducers: {
        clearUserData: (state) => {
            state.response.userStatus = "unset";
            state.response.userData = {
                displayName: "",
                email: "",
                name: "",
                profileAvatar: "",
                userId: ""
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserData.pending, (state)=>{
            state.loading = loadingState.PENDING;
        });

        builder.addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserDetails>) => {
            state.loading = loadingState.SUCCESS;
            state.response.userStatus = "good";
            state.response.userData = action.payload;
        });

        builder.addCase(fetchUserData.rejected, (state, action)=>{
            state.loading = loadingState.FAILED;
            state.error = "An error occured";
        });
    }
})

export const { clearUserData } = userDataState.actions;
export const UserDataStateSlice = userDataState.reducer;



export const echoUserData = (state: RootState) => state.userData;