"use client"

import useAuthenticate from "@/lib/Hooks/useAuthenticate";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";


const socket = io("http://localhost:2222", {
    path: "/api/webServer"
});

export default function SessionPolice() {
    const [textText, setTextText] = useState<string | undefined>("");
    useAuthenticate();

    useEffect(() => {
        if(!socket) return;
        // Example: Listening for server events
        socket.on("connect", () => {
            setTextText(socket.id);
        });

        return () => {
            socket.disconnect();
        }
    });


    const handleClick = () => {
        if(!socket) return;
        const payload = Math.random();

        socket.emit("changeEvent", payload);
    }

    return (
        <>
            <button type="button" onClick={handleClick}>
                {textText}
            </button>
        </>
    )
}