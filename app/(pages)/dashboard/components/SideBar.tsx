"use client";

import { FaAngleRight, FaPlus } from "react-icons/fa6";
import { CiBoxList, CiDesktop, CiSettings } from "react-icons/ci";
import NameTag from "./sub components/side components/NameTag";
import { echoUserData } from "@/Redux Store/Slices/user data";
import { useSelector } from "react-redux";
import { loadingState } from "@/lib/Enums";

export default function SideBar() {
    const { loading, response } = useSelector(echoUserData);



    return (
        <section className="w-[15rem] h-screen p-4 flex flex-col">
            {loading === loadingState.SUCCESS && <NameTag 
                username={response.userData?.name ?? ""}
                abbr={(response.userData.name).split("").splice(0, 2).join("")}
            />}
            <div className="flex-1 flex flex-col my-6">
                {/* Nav Links */}
                <div className="grid h-fit font-semibold">
                    <div className="flex items-center gap-3 p-4 text-sm active:scale-95 cursor-pointer">
                        <span className="text-2xl text-theme-main">
                            <CiDesktop />
                        </span>
                        <span className="">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 text-sm opacity-65 active:scale-95 cursor-pointer hover:opacity-70">
                        <span className="text-2xl">
                            <CiSettings />
                        </span>
                        <span className="">Settings</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 text-sm opacity-65 active:scale-95 cursor-pointer hover:opacity-70">
                        <span className="text-2xl">
                            <CiBoxList />
                        </span>
                        <span className="">All Activites</span>
                    </div>
                </div>
                {/* Projects List */}
                <div className="flex-1 flex flex-col mt-2 gap-1">
                    <div className="flex items-center gap-3 p-4 text-sm dark:bg-black/40 bg-white/50 rounded-md cursor-pointer active:scale-95">
                        <span>
                            <FaAngleRight />
                        </span>
                        <span className="truncate select-none">
                            ✔️ Daily Task
                        </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 text-sm hover:dark:bg-black/20 hover:bg-white/50 rounded-md cursor-pointer active:scale-95">
                        <span>
                            <FaAngleRight />
                        </span>
                        <span className="truncate select-none">
                            🤝 Meeting Summary
                        </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 text-sm hover:dark:bg-black/20 hover:bg-white/50 rounded-md cursor-pointer active:scale-95">
                        <span>
                            <FaAngleRight />
                        </span>
                        <span className="truncate select-none">
                            🚀 Resources
                        </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 text-sm hover:dark:bg-black/20 hover:bg-white/50 rounded-md cursor-pointer active:scale-95">
                        <span>
                            <FaAngleRight />
                        </span>
                        <span className="truncate select-none">
                            📆 Avalaibility
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex py-4 font-semibold px-6 rounded-md gap-3 items-center justify-center text-sm cursor-pointer active:scale-90 bg-theme-text">
                <FaPlus />
                <span>New Project</span>
            </div>
        </section>
    )
}