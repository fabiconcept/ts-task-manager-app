import { FaAngleLeft, FaEllipsisVertical } from "react-icons/fa6";
import Home from "../../../components/project board/Home";
import Link from "next/link";

export default function page({ params }: { params: { project_id: string } }) {
    return (
        <div className="w-full h-screen relative dark:bg-white/5 bg-black/5 overflow-y-auto flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-b-black/50 bg-white/5">
                <Link className="text-2xl font-semibold flex gap-2 items-center" href={"../../dashboard"}><FaAngleLeft />Dashboard</Link>
                <div className="h-8 w-8 rounded-full grid place-items-center border border-white/20 hover:border-white/70 hover:bg-white/10 cursor-pointer active:scale-90 hover:scale-105">
                    <FaEllipsisVertical />
                </div>
            </div>
            <div className={"px-6 flex flex-col gap-4 mt-6"}>
                <h1 className="md:text-4xl sm:text-2xl text-xl text-theme-text">Google&apos;s project board</h1>
                <p className={"max-w-[clamp(30rem,80%,50rem)] opacity-60"}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolorum nostrum perspiciatis, aut amet alias tempore maxime distinctio deserunt officiis?</p>
            </div>
            <Home />
        </div>
    );
}