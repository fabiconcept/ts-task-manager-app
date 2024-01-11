import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

export default function NameTag({ username, abbr }: { username: string, abbr: string }) {
    
    return (
        <div className="mt-8 flex py-2 px-3 rounded-md bg-white/10 gap-3 items-center text-sm cursor-pointer hover:bg-white/25 active:scale-90 dark:shadow-[0_2.5px_25px_rgba(255,255,255,0.05)] hover:dark:shadow-[0_2.5px_25px_rgba(255,255,255,0.1)] shadow-[0_2.5px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_2.5px_25px_rgba(0,0,0,0.1)] border dark:border-white/10 border-black/10">
            <div className="p-1 h-8 w-8 bg-theme-main text-theme-white-dark rounded grid place-items-center font-bold">{abbr}.</div>
            <span className="flex-1 select-none truncate">{username}</span>
            <span className="flex flex-col text-xs pr-2">
                <FaAngleUp />
                <FaAngleDown />
            </span>
        </div>
    )
}