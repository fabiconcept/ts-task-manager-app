export default function Project() {
    return (
        <div className="flex items-center px-4 p-2 border-l-[4px] border-theme-main rounded dark:bg-white/5 bg-black/5 hover:border cursor-pointer select-none">
            <div className="flex-1 flex flex-col">
                <span className="text-lg font-semibold">Courso</span>
                <span className="opacity-50 text-sm">32 members</span>
            </div>
            <div className="rounded bg-theme-main/50 px-1 text-sm">10</div>
        </div>
    )
}
