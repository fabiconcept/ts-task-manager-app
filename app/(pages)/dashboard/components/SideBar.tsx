"use client";

import { FaAngleRight, FaPlus } from "react-icons/fa6";
import NameTag from "./sub components/side components/NameTag";
import { echoUserData } from "@/Redux Store/Slices/user data";
import { useSelector } from "react-redux";
import { loadingState } from "@/lib/Enums";
import NavLinks from "./sub components/side components/NavLinks";
import { useState } from "react";
import clsx from "clsx";

export default function SideBar() {
    const { loading, response } = useSelector(echoUserData);
    const [collapseSide, setCollapseSide] = useState(false);

    return (
        <section className={clsx(
            "h-screen p-4 flex flex-col relative gap-12 py-8",
            collapseSide ? "w-[4rem]" : "w-[15rem]"
        )}>
            {loading === loadingState.SUCCESS && <NameTag 
                username={response.userData?.name ?? ""}
                abbr={(response.userData.name).split("").splice(0, 2).join("")}
            />}

            <div 
                onClick={()=>setCollapseSide(!collapseSide)} 
                className={"absolute opacity-30 hover:opacity-100 top-1/2 -translate-y-1/2 -right-6 h-6 w-6 overflow-hidden rounded-r-full border border-theme-text grid place-items-center cursor-pointer hover:scale-125 active:scale-90"}
                title={collapseSide ? "Expand sidebar" : "Collapse sidebar"}
            >
                <span className={clsx(
                    collapseSide ? "" : "rotate-180"
                )}>
                    <FaAngleRight />
                </span>
            </div>
            
            {/* Nav Links */}
            <div className="flex flex-col">
                <NavLinks />
            </div>
        </section>
    )
}