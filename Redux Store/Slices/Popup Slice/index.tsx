import { RootState } from "@/Redux Store";
import { PopupType } from "@/lib/Enums";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
    isOpen: boolean;
    popUpType: PopupType | "";
    popUpId: string;
}

const initialState: InitialState = {
    isOpen: false,
    popUpType: "",
    popUpId: '',
}

const popUpData = createSlice({
    name: "pop-up-data",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<{popUpType: PopupType}>) => {
            const payload = action.payload.popUpType;

            state.isOpen = true;
            state.popUpType = payload;
        },

        closeModal: (state) => {
            state.isOpen = false;
            state.popUpType = "";
        }
    }
});

export const {
    closeModal,
    openModal
} = popUpData.actions;

export const popUpSlice = popUpData.reducer;

export const echoPopUpIsOpen = (state: RootState) => state.popUp.isOpen;
export const echoPopUpType = (state: RootState) => state.popUp.popUpType;
export const echoPopUpId = (state: RootState) => state.popUp.popUpId;