import { FaAngleLeft, FaEllipsisVertical } from "react-icons/fa6";
import Home from "../../../components/DND Kit/Home";
import Link from "next/link";

export default function page({ params }: { params: { project_id: string } }) {
    return (
        <div className="w-full h-full relative dark:bg-white/5 bg-black/5 overflow-y-auto">
            <div className="p-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold flex gap-2 items-center">
                    <Link href={"../../dashboard"}><FaAngleLeft /></Link>
                    Project Board
                </h1>
                <div className="h-8 w-8 rounded-full grid place-items-center border border-white/20 hover:border-white/70 hover:bg-white/10 cursor-pointer active:scale-90 hover:scale-105">
                    <FaEllipsisVertical />
                </div>
            </div>
            <div className={"px-6"}>
                <p className={"max-w-[30erem]"}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolorum nostrum perspiciatis, aut amet alias tempore maxime distinctio deserunt officiis?</p>
            </div>
            <Home />
        </div>
    );
}