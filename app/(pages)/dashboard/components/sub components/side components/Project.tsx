import { TaskerProject } from "@/lib/Interfaces";


export default function Project({data}: {data: TaskerProject}) {
    return (
        <div className="flex items-center px-4 p-2 border-l-[4px] border-transparent rounded dark:bg-white/5 bg-black/5 hover:border-theme-main border cursor-pointer select-none active:scale-90 active:opacity-50">
            <div className="flex-1 flex flex-col">
                <span className="text-lg font-semibold">{data.title}</span>
                {data.membersCount > 0 && <span className="opacity-50 text-sm">{data.membersCount} member{data.membersCount > 1 ? "s": ""}</span>}
                {data.membersCount === 0 && <span className="opacity-50 text-sm">No member</span>}
            </div>
            <div className="rounded bg-theme-main/50 px-1 text-sm">{data.tasksCount}</div>
        </div>
    )
}
