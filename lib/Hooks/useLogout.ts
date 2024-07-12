"use client"

import { removeSessionData } from "../session";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux Store";
import { clearUserData } from "@/Redux Store/Slices/user data";
import { cleanResponse as cleanResponseProfiles } from "@/Redux Store/Slices/profiles";
import { cleanResponse as cleanResponseProjects } from "@/Redux Store/Slices/profiles/projects";
import { signOut, useSession } from "next-auth/react";

const useLogout = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status } = useSession();

    const logout = async () => {
        try {
            removeSessionData("taskerId");
            dispatch(clearUserData());
            dispatch(cleanResponseProfiles());
            dispatch(cleanResponseProjects());
            if (status === "authenticated") {
                signOut();
            }

            const newUrl = document.createElement("a");
            newUrl.href = "/auth/login";
            newUrl.click();
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return { logout };
};

export default useLogout;
