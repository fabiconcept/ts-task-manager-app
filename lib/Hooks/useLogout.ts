"use client"

import { useRouter } from "next/navigation";
import { removeSessionData } from "../session";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux Store";
import { clearUserData } from "@/Redux Store/Slices/user data";
import { cleanResponse as cleanResponseProfiles } from "@/Redux Store/Slices/profiles";
import { cleanResponse as cleanResponseProjects } from "@/Redux Store/Slices/profiles/projects";

const useLogout = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const logout = async () => {
        try {
            removeSessionData("taskerId");
            dispatch(clearUserData());
            dispatch(cleanResponseProfiles());
            dispatch(cleanResponseProjects());
            router.push("/auth/login");
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return { logout };
};

export default useLogout;
