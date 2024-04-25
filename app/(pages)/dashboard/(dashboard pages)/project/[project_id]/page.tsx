import { FaAngleLeft, FaEllipsisVertical } from "react-icons/fa6";
import TaskBoard from "./project board/TaskBoard";
import Link from "next/link";
import { getProject } from "@/lib/functions";

export default async function page({ params }: { params: { project_id: string } }) {
    const { project_id } = params;

    try {
        const projectData = await getProject(project_id);

        return (
            <div className="w-full h-screen relative bg-black/5 overflow-y-auto flex flex-col">
                <div className="sticky top-0 backdrop-blur-md z-20 p-6 flex items-center justify-between border-b border-b-white/10 bg-white/5">
                    <Link className="text-2xl font-semibold flex gap-2 items-center" href={"../../dashboard"}><FaAngleLeft />Dashboard</Link>
                    <div className="h-8 w-8 rounded-full grid place-items-center border border-white/20 hover:border-white/70 hover:bg-white/10 cursor-pointer active:scale-90 hover:scale-105">
                        <FaEllipsisVertical />
                    </div>
                </div>
                <div className={"px-6 flex flex-col gap-4 mt-6"}>
                    <h1 className="md:text-4xl sm:text-2xl text-xl text-theme-text">
                        {projectData.title}
                    </h1>
                    <p className={"max-w-[clamp(30rem,80%,50rem)] opacity-60"}>
                        {projectData.description}
                    </p>
                </div>
                <TaskBoard project_id={project_id} />
            </div>
        );
    } catch (error) {
        return (
            <div className="w-full h-screen relative bg-black/5 overflow-y-auto flex flex-col items-center justify-center">
                <span className={"text-red-500"}>
                    {`${error}`}
                </span>

                <Link href={"../../dashboard"}>Go back home</Link>
            </div>
        )
    }
}