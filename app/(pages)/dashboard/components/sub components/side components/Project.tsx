import { TaskerProject } from "@/lib/Interfaces";
import ShowElement from "@/lib/utilities/Show";
import Link from "next/link";
import { MouseEvent } from "react";

export default function Project({data, isOpen}: {data: TaskerProject, isOpen: string | null}) {
    return (
        <Link href={`/dashboard/project/${data.project_id}`} className="flex items-center px-4 p-2 border-l-[4px] border-transparent rounded dark:bg-white/5 bg-black/5 hover:border-theme-main border cursor-pointer select-none active:scale-90 active:opacity-50">
            <div className="flex-1 flex flex-col">
                <p className="text-sm font-semibold max-w-[80%] truncate">{data.title}</p>
                <ShowElement.when isTrue={data.membersCount > 0}>
                    {<span className="opacity-40 text-sm">{data.membersCount} member{data.membersCount > 1 ? "s" : ""}</span>}
                </ShowElement.when>
                <ShowElement.when isTrue={data.membersCount === 0}>
                    {<span className="opacity-40 text-sm">{isOpen}</span>}
                </ShowElement.when>
            </div>
            <div className="rounded bg-theme-main/50 px-1 text-sm">{data.tasksCount}</div>
        </Link>
    )
}
