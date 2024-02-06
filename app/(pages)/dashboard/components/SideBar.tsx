"use client";

import { FaAngleRight } from "react-icons/fa6";
import NameTag from "./sub components/side components/NameTag";
import { echoUserData } from "@/Redux Store/Slices/user data";
import { useSelector } from "react-redux";
import { loadingState } from "@/lib/Enums";
import { useState } from "react";
import clsx from "clsx";
import ProjectList from "./sub components/side components/ProjectList";
import { echoTaskerProfilesError, echoTaskerProfilesLoading } from "@/Redux Store/Slices/profiles";

export default function SideBar() {
    const { loading } = useSelector(echoUserData);
    const isTaskerProfilesLoading = useSelector(echoTaskerProfilesLoading);
    const taskerProfilesErrorMsg = useSelector(echoTaskerProfilesError);
    const [collapseSide, setCollapseSide] = useState(false);

    return (
        <div className="relative group z-[40]">
            <section className={clsx(
                "h-screen p-4 flex flex-col gap-6 py-6 overflow-hidden shadow-md border-r border-transparent group-hover:dark:border-white/10 group-hover:border-black/10",
                collapseSide ? "w-0 opacity-30" : "w-[15rem]"
            )}>
                {loading === loadingState.SUCCESS && <NameTag />}
                {isTaskerProfilesLoading === loadingState.SUCCESS && <ProjectList />}
                {isTaskerProfilesLoading === loadingState.PENDING && <span className="text-center animate-pulse">loading...</span>}
                {isTaskerProfilesLoading === loadingState.FAILED && <span className="text-center text-red-500">{taskerProfilesErrorMsg}</span>}

            </section>

            {/* Collapse Handle */}
            <div
                onClick={() => setCollapseSide(!collapseSide)}
                className={"absolute opacity-0 group-hover:opacity-100 top-1/2 translate-y-1/2 -right-6 h-6 w-6 overflow-hidden rounded-r-full border border-theme-text grid place-items-center cursor-pointer hover:scale-125 active:scale-90"}
                title={collapseSide ? "Expand sidebar" : "Collapse sidebar"}
            >
                <span className={clsx(
                    collapseSide ? "" : "rotate-180"
                )}>
                    <FaAngleRight />
                </span>
            </div>
        </div>
    )
}