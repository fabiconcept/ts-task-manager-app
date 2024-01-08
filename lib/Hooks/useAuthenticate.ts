"use client"

import { useEffect, useMemo, useState } from "react";
import { retrieveActiveSession } from "../session/helper";
import { useRouter } from "next/navigation";
import { UserDetails } from "../Interfaces";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "../Types";
import { removeSessionCookie } from "../session";



export default function useAuthenticate(): void {
    const [hasSession, sessionId] = retrieveActiveSession();
    const router = useRouter();
    const [userDetails, setUserDetails] = useState<UserDetails>();

    useMemo(() => {
        if (!userDetails) return;
        
    }, [userDetails]);

    useEffect(() => {
        if (sessionId === null) return;
        if (!hasSession || sessionId === "") {
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
    
                const res: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<UserDetails> = await req.json();
                const { status, message } = res;
    
                if(status === 400) {
                    throw new Error(message);
                }else {
                    const data = res.data;

                    setUserDetails({
                        displayName: data.displayName,
                        email: data.email,
                        name: data.name,
                        profileAvatar: data.profileAvatar,
                        userId: data.userId
                    });
                }
            } catch (error) {
                console.error("Error:", error);
                removeSessionCookie("taskerId");
                router.push("/auth/login");
            }
        }

        getData();
    }, [hasSession, sessionId, router]);
}