"use client"
import { echoTaskerProfilesActiveId } from "@/Redux Store/Slices/profiles";
import Project from "./Project";
import SearchFeature from "./SearchFeature";
import { useSelector } from "react-redux";

export default function ProjectList() {
    const activeId = useSelector(echoTaskerProfilesActiveId);
    

    return (
        <>
            <SearchFeature />
            <div className="flex-1 h-full overflow-y-auto flex flex-col gap-1 relative">
                <p className="text-sm opacity-50 sticky top-0 mb-2">Projects</p>
                <Project />
                <Project />
                <Project />
                <Project />
                <Project />
                <Project />
            </div>
        </>
    );
}