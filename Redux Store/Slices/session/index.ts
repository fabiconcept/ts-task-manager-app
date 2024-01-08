import { RootState } from "@/Redux Store";
import { SessionState } from "@/lib/Types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: SessionState = {
    hasSession: false,
    sessionId: "",
}

const sessionState = createSlice({
    name: "session",
    initialState: initialState,
    reducers: {
        updateSession: (state, payload:PayloadAction<{hasSession: boolean, sessionId: string}>) => {
            const { hasSession, sessionId } = payload.payload;
            state.hasSession = hasSession;
            state.sessionId = sessionId;
        }
    }
})

export const { updateSession } = sessionState.actions;
export const sessionStateSlice = sessionState.reducer;

export const getSessionId = (state: RootState)=> state.session.sessionId;
export const getSessionStatus = (state: RootState)=> state.session.hasSession;