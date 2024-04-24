"use client"
import { TaskerProject } from "@/lib/Interfaces";
import ShowElement from "@/lib/utilities/Show";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Project({ data }: { data: TaskerProject }) {
    const urlParam = useParams();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if(!urlParam.project_id) {
            setIsOpen(false);
            return;
        };
        setIsOpen(urlParam.project_id === data.project_id);
    }, [urlParam, data]);

    return (
        <Link href={`/dashboard/project/${data.project_id}`} className={clsx(
            "flex items-center px-4 p-2 rounded dark:bg-white/5 bg-black/5 cursor-pointer select-none active:scale-90 active:opacity-50 border",
            isOpen ? "border-theme-main border-l-[8px]" : "border-transparent hover:border-theme-main"
            )}
            >
            <div className="flex-1 flex flex-col">
                <p className="text-sm font-semibold max-w-[80%] truncate">{data.title}</p>
                <ShowElement.when isTrue={data.membersCount > 0}>
                    {<span className="opacity-40 text-sm">{data.membersCount} member{data.membersCount > 1 ? "s" : ""}</span>}
                </ShowElement.when>
                <ShowElement.when isTrue={data.membersCount === 0}>
                    {<span className="opacity-40 text-sm">No member</span>}
                </ShowElement.when>
            </div>
            <div className="rounded bg-theme-main/50 px-1 text-sm">{data.tasksCount}</div>
        </Link>
    )
}
