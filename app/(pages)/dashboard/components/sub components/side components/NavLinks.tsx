"use client"

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CiBoxList, CiDesktop, CiSettings } from "react-icons/ci";

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
            default:
                setActiveTab(1);
                break
        }
    }, [pathName]);



    return (
        <div className="grid h-fit font-semibold select-none">
            <Link onClick={()=>setActiveTab(1)} href={"/dashboard/"} className={clsx(
                "flex items-center gap-3 p-4 text-sm active:scale-95 cursor-pointer rounded",
                activeTab === 1 ? "border border-theme-text/25 text-theme-text" : "opacity-65 hover:opacity-70"
            )}>
                <span className={clsx(
                    "text-2xl"
                )}>
                    <CiDesktop />
                </span>
                <span className="">Dashboard</span>
            </Link>

            <Link onClick={()=>setActiveTab(2)} href={"/dashboard/settings"} className={clsx(
                "flex items-center gap-3 p-4 text-sm active:scale-95 cursor-pointer rounded",
                activeTab === 2 ? "border border-theme-text/25 text-theme-text" : "opacity-65 hover:opacity-70"
            )}>
                <span className={clsx(
                    "text-2xl"
                )}>
                    <CiSettings />
                </span>
                <span className="">Settings</span>
            </Link>

            <Link onClick={()=>setActiveTab(3)} href={"/dashboard/activities"} className={clsx(
                "flex items-center gap-3 p-4 text-sm active:scale-95 cursor-pointer rounded",
                activeTab === 3 ? "border border-theme-text/25 text-theme-text" : "opacity-65 hover:opacity-70"
            )}>
                <span className={clsx(
                    "text-2xl"
                )}>
                    <CiBoxList />
                </span>
                <span className="">All Activites</span>
            </Link>
        </div>
    )
}
