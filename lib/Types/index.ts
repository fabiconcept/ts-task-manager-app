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

export type ResponseWithoutError = {
    status: 200,
    type: AuthResponseType,
    message: {
        userId: string,
        auth: string
    }
}

export type ValidateAuthResponseWithoutError<T> = {
    status: 200,
    type: AuthResponseType.NoError,
    message: "Authentication successful",
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