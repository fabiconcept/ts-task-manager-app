import { CiSearch } from "react-icons/ci";
import { GoBell } from "react-icons/go";
import { GiCheckMark } from "react-icons/gi";
import Home from "./components/DND Kit/Home";

export default function DashboardPage() {
    return (
        <div className="flex-1 p-8 pt-6 dark:bg-black/20 bg-white/70">
            <div className="py-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold flex items-center gap-3"><span className="text-theme-main"><GiCheckMark /></span> Daily Task</h1>
                <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 grid place-items-center rounded-full bg-theme-text/5">
                        <CiSearch />
                    </div>
                    <div className="h-10 w-10 grid place-items-center rounded-full bg-theme-text/5">
                        <GoBell />
                    </div>
                </div>
            </div>
            <div className="opacity-80">
                <p>Click <span className="px-2 py-1 mx-2 rounded text-theme-text bg-theme-text/5">+ New</span>
                to create a new list and wait for project manager card.</p>
                <p>Don&apos;t create a card by yourself to manage a good collaboration.</p>
            </div>

            <div>
                <Home />
            </div>
        </div>
    );
}