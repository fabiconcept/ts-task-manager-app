"use client"

import { useRouter } from "next/navigation";
import { removeSessionCookie } from "../session";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux Store";
import { clearUserData } from "@/Redux Store/Slices/user data";

const useLogout = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const logout = async () => {
        try {
            removeSessionCookie("taskerId");
            dispatch(clearUserData());
            router.push("/auth/login");
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return { logout };
};

export default useLogout;
