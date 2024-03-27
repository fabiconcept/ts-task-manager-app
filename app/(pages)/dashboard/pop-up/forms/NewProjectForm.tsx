import { TaskerProject } from "@/lib/Interfaces";
import clsx from "clsx";
import { FormEvent } from "react";
import { FaFileLines, FaHeading, FaPlus, FaTriangleExclamation } from "react-icons/fa6";

interface NewProject extends Pick<TaskerProject, "title" | "description" | "status" | "priority">{};


export default function NewProjectForm() {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

    }
    return (
        <form onSubmit={handleSubmit} className={clsx("flex flex-col gap-6")}>
            <div className="flex items-center gap-2 text-xl font-semibold pb-4 border-b dark:border-b-white/10 border-b-black/10"> <span className="opacity-50 text-theme-main"><FaPlus/></span> New project</div>
            <div className={"flex flex-col gap-4"}>
                <div className={clsx("flex items-center bg-white/5 focus-within:bg-white/25 overflow-hidden rounded-md border dark:border-white/20 focus-within:dark:border-theme-main")}>
                    <span className="p-3 text-theme-main bg-white/5 group-focus-within:bg-theme-main group-focus-within:text-black"><FaHeading /></span>
                    <input 
                        type="text" 
                        placeholder="Project title" 
                        className={clsx("bg-transparent outline-none flex-1 p-2")}
                    />
                </div>
                <div className={clsx("flex items-center bg-white/5 focus-within:bg-white/25 overflow-hidden rounded-md border dark:border-white/20 focus-within:dark:border-theme-main")}>
                    <span className="p-3 text-theme-main bg-white/5 group-focus-within:bg-theme-main group-focus-within:text-black"><FaFileLines /></span>
                    <input 
                        type="text" 
                        placeholder="Project description" 
                        className={clsx("bg-transparent outline-none flex-1 p-2")}
                    />
                </div>
                <div className={clsx("flex items-center bg-white/5 focus-within:bg-white/25 overflow-hidden rounded-md border dark:border-white/20 focus-within:dark:border-theme-main")}>
                    <span className="p-3 text-theme-main bg-white/5 group-focus-within:bg-theme-main group-focus-within:text-black"><FaTriangleExclamation /></span>
                    <input 
                        type="text" 
                        placeholder="title" 
                        className={clsx("bg-transparent outline-none flex-1 p-2")}
                    />
                </div>
            </div>
        </form>
    )
}