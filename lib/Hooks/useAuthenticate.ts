"use client"

import { useEffect } from "react";
import { retrieveActiveSession } from "../session/helper";
import { useRouter } from "next/navigation";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "../Types";
import { removeSessionData } from "../session";
import { useDispatch } from "react-redux";
import { fetchUserData } from "@/Redux Store/Thunk";
import { AppDispatch } from "@/Redux Store";

export default function useAuthenticate(cookieData: string): void {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const apiURL = "http://localhost:3000/api/authentication/validateAuth";

    useEffect(() => {
        if (!cookieData) {
            console.error("Session data not found");
            router.push("/auth/login");
            return;
        }

        async function getData () {
            try {
                const req = await fetch(apiURL, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        authenticationKey: cookieData
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
                removeSessionData("taskerId");
                router.push("/auth/login");
            }
        }

        getData();
    }, [router, dispatch, cookieData]);
}