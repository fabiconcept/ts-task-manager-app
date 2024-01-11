"use client"

import { useEffect } from "react";
import { retrieveActiveSession } from "../session/helper";
import { useRouter } from "next/navigation";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "../Types";
import { removeSessionCookie } from "../session";
import { useDispatch } from "react-redux";
import { fetchUserData } from "@/Redux Store/Thunk";
import { AppDispatch } from "@/Redux Store";

export default function useAuthenticate(): void {
    const [hasSession, sessionId] = retrieveActiveSession();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (sessionId === null) return;

        if (!hasSession || sessionId === "") {
            console.error("Session data not found");
            router.push("/auth/login");
            return;
        }
        async function getData () {
            try {
                const req = await fetch("api/authentication/validateAuth", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        authenticationKey: sessionId
                    })
                })
    
                const res: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<string> = await req.json();
                const { status, message } = res;
    
                if(status === 400) {
                    throw new Error(message);
                }else {
                    dispatch(fetchUserData(res.data));
                }
            } catch (error) {
                console.error("Error:", error);
                removeSessionCookie("taskerId");
                router.push("/auth/login");
            }
        }

        getData();
    }, [hasSession, sessionId, router, dispatch]);
}