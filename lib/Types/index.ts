import { NextApiResponse } from "next";
import { AuthResponseType } from "../Enums";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import { UniqueIdentifier } from "@dnd-kit/core";

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
    email: string;
    status: "active" | "suspended" | "blocked" | "pending";
    type: "editor" | "worker" | "owner",
    joined_on: string;
}


export type UserProject = {
    profile_id: string;
    last_used: string;
}

// DND Kit

export type DNDType = {
    id: UniqueIdentifier;
    title: string;
    items: { id: UniqueIdentifier, title: string }[];
};

export default interface ContainerProps {
    id: UniqueIdentifier;
    children: React.ReactNode;
    title?: string;
    description?: string;
    itemsCount: number;
    onAddItem?: () => void;
}