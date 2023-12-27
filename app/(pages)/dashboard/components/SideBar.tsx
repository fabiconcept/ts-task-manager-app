import { FaAngleDown, FaAngleRight, FaAngleUp, FaPlus } from "react-icons/fa6"
import { CiBoxList, CiDesktop, CiSettings } from "react-icons/ci"

export default function SideBar() {
    return (
        <section className="w-[15rem] h-screen p-4 flex flex-col">
            <div className="flex py-2 px-3 rounded-md bg-white/10 gap-3 items-center text-sm cursor-pointer hover:bg-white/25 active:scale-90 dark:shadow-[0_2.5px_25px_rgba(255,255,255,0.05)] hover:dark:shadow-[0_2.5px_25px_rgba(255,255,255,0.1)] shadow-[0_2.5px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_2.5px_25px_rgba(0,0,0,0.1)] border dark:border-white/10 border-black/10">
                <div className="p-1 h-8 w-8 bg-theme-text rounded grid place-items-center font-bold">Ta.</div>
                <span className="flex-1 select-none truncate">Taskify</span>
                <span className="flex flex-col text-xs pr-2">
                    <FaAngleUp />
                    <FaAngleDown />
                </span>
            </div>
            <div className="flex-1 flex flex-col my-6">
                {/* Nav Links */}
                <div className="grid h-fit">
                    <div className="flex items-center gap-3 p-4 text-sm opacity-50 active:scale-95 cursor-pointer hover:opacity-70">
                        <span className="text-2xl">
                            <CiDesktop />
                        </span>
                        <span className="">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 text-sm opacity-50 active:scale-95 cursor-pointer hover:opacity-70">
                        <span className="text-2xl">
                            <CiSettings />
                        </span>
                        <span className="">Settings</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 text-sm opacity-50 active:scale-95 cursor-pointer hover:opacity-70">
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
            <div className="flex py-4 font-semibold px-6 rounded-md gap-3 items-center text-sm cursor-pointer active:scale-90 bg-theme-text">
                <FaPlus />
                <span>New Project</span>
            </div>
        </section>
    )
}