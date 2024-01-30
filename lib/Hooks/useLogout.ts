"use client"

import { useRouter } from "next/navigation";
import { removeSessionData } from "../session";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux Store";
import { clearUserData } from "@/Redux Store/Slices/user data";

const useLogout = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const logout = async () => {
        try {
            removeSessionData("taskerId");
            dispatch(clearUserData());
            router.push("/auth/login");
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return { logout };
};

export default useLogout;
