"use client"

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CiBoxList, CiDesktop, CiSettings, CiUser } from "react-icons/ci";

export default function NavLinks() {
    const [activeTab, setActiveTab] = useState(1);
    const pathName = usePathname();

    useEffect(() => {
        switch(pathName) {
            case "/dashboard" :
                setActiveTab(1);
                break
            case "/dashboard/settings" :
                setActiveTab(2);
                break
            case "/dashboard/activities" :
                setActiveTab(3);
                break
            case "/dashboard/profile" :
                setActiveTab(4);
                break
            default:
                setActiveTab(1);
                break
        }
    }, [pathName]);



    return (
        <div className="grid h-fit py-8 border-y dark:border-white/5 border-black/5 font-semibold select-none">
            <Link onClick={()=>setActiveTab(1)} href={"/dashboard/"} className={clsx(
                "flex items-center gap-3 p-4 text-sm active:scale-95 cursor-pointer relative after:absolute after:content-['Dashboard'] after:whitespace-nowrap after:top-1/2 after:-translate-y-1/2 after:-right-[5.5rem] hover:after:-right-[7rem] after:opacity-0 hover:after:opacity-100 after:duration-300 after:delay-150 after:text-base after:w-auto after:px-2 after:rounded after:bg-theme-main after:text-black after:font-semibold",
                activeTab === 1 ? "border border-theme-text/25 text-theme-text" : "opacity-45 hover:opacity-80"
            )}>
                <span className={clsx(
                    "text-2xl"
                )}>
                    <CiDesktop />
                </span>
            </Link>

            <Link onClick={()=>setActiveTab(2)} href={"/dashboard/settings"} className={clsx(
                "flex items-center gap-3 p-4 text-sm active:scale-95 cursor-pointer  relative after:absolute after:content-['Settings'] after:whitespace-nowrap after:top-1/2 after:-translate-y-1/2 after:-right-[4rem] hover:after:-right-[5.5rem] after:opacity-0 hover:after:opacity-100 after:duration-300 after:delay-150 after:text-base after:w-auto after:px-2 after:rounded after:bg-theme-main after:text-black after:font-semibold",
                activeTab === 2 ? "border border-theme-text/25 text-theme-text" : "opacity-45 hover:opacity-80"
            )}>
                <span className={clsx(
                    "text-2xl"
                )}>
                    <CiSettings />
                </span>
            </Link>

            <Link onClick={()=>setActiveTab(3)} href={"/dashboard/activities"} className={clsx(
                "flex items-center gap-3 p-4 text-sm active:scale-95 cursor-pointer  relative after:absolute after:content-['Activites'] after:whitespace-nowrap after:top-1/2 after:-translate-y-1/2 after:-right-[4rem] hover:after:-right-[5.5rem] after:opacity-0 hover:after:opacity-100 after:duration-300 after:delay-150 after:text-base after:w-auto after:px-2 after:rounded after:bg-theme-main after:text-black after:font-semibold",
                activeTab === 3 ? "border border-theme-text/25 text-theme-text" : "opacity-45 hover:opacity-80"
            )}>
                <span className={clsx(
                    "text-2xl"
                )}>
                    <CiBoxList />
                </span>
            </Link>

            <Link onClick={()=>setActiveTab(4)} href={"/dashboard/activities"} className={clsx(
                "flex items-center gap-3 p-4 text-sm active:scale-95 cursor-pointer  relative after:absolute after:content-['My Profile'] after:whitespace-nowrap after:top-1/2 after:-translate-y-1/2 after:-right-[4rem] hover:after:-right-[5.5rem] after:opacity-0 hover:after:opacity-100 after:duration-300 after:delay-150 after:text-base after:w-auto after:px-2 after:rounded after:bg-theme-main after:text-black after:font-semibold",
                activeTab === 4 ? "border border-theme-text/25 text-theme-text" : "opacity-45 hover:opacity-80"
            )}>
                <span className={clsx(
                    "text-2xl"
                )}>
                    <CiUser />
                </span>
            </Link>
        </div>
    )
}
