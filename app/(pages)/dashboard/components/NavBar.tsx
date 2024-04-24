"use client"
import { GiShotgun } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import useLogout from "@/lib/Hooks/useLogout";
import { useState } from "react";
import Image from "next/image";
import NavLinks from "./sub components/side components/NavLinks";

export default function NavBar() {
    const [loggingOut, setLoggingOut] = useState(false);
    const { logout } = useLogout();

    const handleLogOut = () => {
        if (loggingOut) return;
        setLoggingOut(true);
        logout();
    }
    return (
        <nav className="bg-white/5 px-4 py-6 flex flex-col items-center gap-8 border-r dark:border-white/10 border-/10 relative z-50">
            <div className="text-4xl">
                <GiShotgun />
            </div>
            <div className="flex-1 grid place-items-center">
                <NavLinks />
            </div>
            <div onClick={handleLogOut} className="grid place-items-center w-fit text-2xl p-2 dark:bg-white/10 bg-black/10 dark:hover:bg-white/25 hover:bg-black/25 rounded-lg cursor-pointer active:scale-90 active:rotate-6 relative after:absolute after:content-['sign_out'] after:whitespace-nowrap after:top-1/2 after:-translate-y-1/2 after:-right-[4rem] hover:after:-right-[5.5rem] after:opacity-0 hover:after:opacity-100 after:duration-300 after:delay-150 after:text-base after:w-auto after:px-2 after:rounded after:bg-theme-main after:text-black after:font-semibold">
                {loggingOut
                    ?
                    <Image
                        src={"https://taskify.sirv.com/spinner.svg"}
                        alt="spinner"
                        height={100}
                        width={100}
                        className="w-6 dark:invert"
                    />
                    :
                    <FiLogOut />
                }
            </div>
        </nav>
    );
}