import { NextApiResponse } from "next";
import { AuthResponseType } from "../Enums";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";

export type RequestBody = {
    name: string;
    email: string;
    password: string;
}

export type SessionState = {
    hasSession: boolean;
    sessionId: string;
}

export type ResponseWithError = {
    status: 400,
    type: AuthResponseType,
    message: string
}

export type ResponseWithoutError<T = { userId: string, auth: string }> = {
    status: 200,
    type: AuthResponseType,
    message: T
};


export type ValidateAuthResponseWithoutError<T> = {
    status: 200,
    type: AuthResponseType.NoError,
    message: string,
    data: T
}

export type ValidateAuthResponseWithError = {
    status: 400,
    type: AuthResponseType.InvalidError,
    message: string,
}

// Socket.io
export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};


export type TeamMember = {
    user_id: string;
    status: "active" | "suspended" | "blocked";
    type: "editor" | "worker",
    joined_on: string;
}


export type UserProject = {
    profile_id: string;
    last_used: string;
}