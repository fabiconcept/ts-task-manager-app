"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { removeSessionData, getSessionData } from "../session";
import { useDispatch } from "react-redux";
import { fetchUserData } from "@/Redux Store/Thunk";
import { AppDispatch } from "@/Redux Store";

export default function useAuthenticate(): void {
    const cookieData = getSessionData("taskerUser");
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        try {
            if (!cookieData) {
                throw new Error("Session data not found");
            }

            dispatch(fetchUserData(cookieData));
        } catch (error) {
            console.error("Error:", error);
            removeSessionData("taskerId");
            removeSessionData("taskerUser");
            router.push("/login");
        }
    }, [router, dispatch, cookieData]);
}