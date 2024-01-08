"use client"
import { AppDispatch } from "@/Redux Store";
import { updateSession } from "@/Redux Store/Slices/session";
import { retrieveActiveSession } from "@/lib/session/helper"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function SessionPolice() {
    const dispatch = useDispatch<AppDispatch>();
    const [hasSession, sessionId] = retrieveActiveSession();
    const router = useRouter();

    useEffect(() => {
        if (sessionId === null) return;
        if (!hasSession || sessionId === "") {
            router.push("/auth/login");
            
            return;
        }

        dispatch(updateSession({ hasSession, sessionId }));

    }, [dispatch, hasSession, sessionId, router]);

    return (
        <></>
    )
}
