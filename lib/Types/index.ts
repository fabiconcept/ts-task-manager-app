export type RequestBody = {
    name: string;
    email: string;
    password: string;
}

export type SessionState = {
    hasSession: boolean;
    sessionId: string;
}