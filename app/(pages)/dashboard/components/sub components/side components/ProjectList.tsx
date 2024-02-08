"use client"
import { echoTaskerProfilesActiveId, echoTaskerProfilesResponse } from "@/Redux Store/Slices/profiles";
import Project from "./Project";
import SearchFeature from "./SearchFeature";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux Store";
import { useEffect, useState } from "react";
import { fetchProjects } from "@/Redux Store/Thunk";
import { echoProjectListError, echoProjectListLoading, echoProjectListResponse } from "@/Redux Store/Slices/profiles/projects";
import { loadingState } from "@/lib/Enums";
import { TaskerProject } from "@/lib/Interfaces";

export default function ProjectList() {
    const dispatch = useDispatch<AppDispatch>();
    const activeId = useSelector(echoTaskerProfilesActiveId);
    const { profiles } = useSelector(echoTaskerProfilesResponse);
    const projectsList = useSelector(echoProjectListResponse);
    const projectsLoading = useSelector(echoProjectListLoading);
    const projectsError = useSelector(echoProjectListError);

    const [projectListDisplay, setProjectListDisplay] = useState<TaskerProject[]>([]);

    useEffect(() => {
        if (!(projectsLoading === loadingState.SUCCESS)) return;
        setProjectListDisplay(projectsList);
    }, [projectsLoading, projectsList]);
    
    useEffect(() => {
        if (!activeId) return;
        const activeProfile = profiles.find((profile)=> profile.profile_id === activeId);

        if (!activeProfile) return;

        const { profile_id } = activeProfile; 


        dispatch(fetchProjects(profile_id));

    }, [dispatch, activeId, profiles]);

    return (
        <>
            {projectsLoading === loadingState.SUCCESS && projectListDisplay.length > 0 && <SearchFeature 
                performFunction={()=>{}} 
                placeholder="find project"
            />}
            <div className="flex-1 h-full overflow-y-auto flex flex-col gap-1 relative">
                <p className="text-sm opacity-50 sticky top-0 mb-2">Projects</p>
                {projectsLoading === loadingState.SUCCESS && projectListDisplay.length > 0 && projectListDisplay.map((project)=> (
                    <Project
                        key={project.project_id}
                        data={project}
                    />
                ))}
                {projectsLoading === loadingState.SUCCESS && projectListDisplay.length === 0 && <span className="text-center opacity-60">
                    No project yet.
                </span>}
                {projectsLoading === loadingState.PENDING && <span className="text-center animate-pulse">
                    loading...
                </span>}
                {projectsLoading === loadingState.FAILED && <span className="text-center text-red-500">
                    {projectsError}
                </span>}
            </div>
        </>
    );
}