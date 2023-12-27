import { CiMicrophoneOn } from "react-icons/ci";
import { FaEllipsis } from "react-icons/fa6";

export default function SendMessageForm() {
    return (
        <form className="flex gap-3 items-center">
            <input 
                type="text" 
                placeholder="write here..." 
                className="flex-1 p-3 py-2 border border-transparent dark:bg-white/20 outline-none rounded-md focus:border-theme-main/50"
            />
            <span className="text-2xl font-semibold cursor-pointer active:scale-90 hover:text-theme-main">
                <CiMicrophoneOn />
            </span>
            <span className="cursor-pointer active:scale-90 hover:text-theme-main">
                <FaEllipsis />
            </span>
        </form>
    )
}