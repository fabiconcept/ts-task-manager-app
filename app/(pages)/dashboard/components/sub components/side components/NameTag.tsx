"use client"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import clsx from "clsx";
import { useState } from "react";
import useLogout from "@/lib/Hooks/useLogout";
import Image from "next/image";

export default function NameTag({ username, abbr }: { username: string, abbr: string }) {
    const [expandDiv, setExpandDiv] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const { logout } = useLogout();

    const handleLogOut = () =>{
        if (loggingOut) return;
        setLoggingOut(true);
        logout();
    }

    return (
        <section className="h-[3.15rem] relative mt-8">
            <div className={clsx(
                "rounded-md grid overflow-hidden transition-[height] bg-white/10 text-sm cursor-pointer dark:shadow-[0_2.5px_25px_rgba(255,255,255,0.05)] hover:dark:shadow-[0_2.5px_25px_rgba(255,255,255,0.1)] shadow-[0_2.5px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_2.5px_25px_rgba(0,0,0,0.1)] border dark:border-white/10 border-black/10 backdrop-blur",
                expandDiv ? "h-[9.25rem]" : "h-[3.15rem]"
            )}>
                <div className="flex gap-3 items-center py-2 px-3 active:scale-90 hover:bg-white/25" onClick={()=>setExpandDiv(!expandDiv)}>
                    <div className="p-1 h-8 w-8 bg-theme-main text-theme-white-dark rounded-md grid place-items-center font-bold">{abbr}.</div>
                    <span className="flex-1 select-none truncate">{username}</span>
                    <span className="flex flex-col text-xs pr-2">
                        <FaAngleUp />
                        <FaAngleDown />
                    </span>
                </div>
                <div className="flex gap-3 items-center py-2 px-3 active:scale-90 hover:bg-white/25">
                    <div className="p-1 h-8 w-8 border dark:bg-theme-white/25 bg-theme-white-dark/25 dark:border-theme-white border-theme-white-black text-theme-white-dark rounded-md grid place-items-center font-bold">
                        <FaUserAlt />
                    </div>
                    <span className="flex-1 select-none">View profle</span>
                </div>
                <div onClick={handleLogOut} className="flex gap-3 items-center py-2 px-3 active:scale-90 hover:bg-red-500/50 group">
                    <div className="p-1 h-8 w-8 bg-red-500 group-hover:bg-white group-hover:text-red-500 text-theme-white-dark rounded-md grid place-items-center font-bold">
                        <FaSignOutAlt />
                    </div>
                    <span className="flex-1 select-none group-hover:text-white">
                        {!loggingOut ? "Log out" : "Logging out"}
                    </span>
                    {loggingOut && <Image
                        src={"https://taskify.sirv.com/spinner.svg"}
                        alt="spinner"
                        height={100}
                        width={100}
                        className="w-3 dark:invert"
                    />}
                </div>
            </div>

        </section>
    )
}