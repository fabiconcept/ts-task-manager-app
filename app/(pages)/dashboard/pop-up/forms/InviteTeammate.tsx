"use client"
import clsx from "clsx";
import { GiHighFive } from "react-icons/gi";
import { FaAt, FaEnvelope, FaUserPlus } from "react-icons/fa6";
import { useContext } from "react";
import { popContext } from "../PopUpDiv";

export default function InviteTeammate() {
    const { setCanClose, handleCloseModal } = useContext(popContext)!;

    return (
        <form className={clsx("flex flex-col gap-6 h-full")}>
            <div className="flex items-center gap-2 text-xl font-semibold pb-4 border-b dark:border-b-white/10 border-b-black/10">
                <span className="opacity-80 text-xl text-theme-main"><FaUserPlus /></span>
                Invite Teammate
            </div>
            <div className={"flex flex-1 overflow-y-auto flex-col gap-6 pb-6"}>
                <span className={"opacity-50"}>Invite your team to review and collaborate on projects.</span>

                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                        )}><FaAt /></span>
                        <span>Email address</span>
                    </span>
                    <input
                        type="text"
                        placeholder="@jeffrey"
                        required
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-md border dark:border-white focus:dark:border-theme-main")}
                    />
                </div>
            </div>
        </form>
    )
}
