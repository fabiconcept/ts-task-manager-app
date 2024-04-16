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
import ShowElement from "@/lib/utilities/Show";

export default function ProjectList() {

    const dispatch = useDispatch<AppDispatch>();
    const activeId = useSelector(echoTaskerProfilesActiveId);
    const { profiles } = useSelector(echoTaskerProfilesResponse);
    const projectsList = useSelector(echoProjectListResponse);
    const projectsLoading = useSelector(echoProjectListLoading);
    const projectsError = useSelector(echoProjectListError);

    const [openProject, setOpenProject]= useState<string | null>("");

    useEffect(() => {
        function getProjectIdFromUrl() {
            try {
                // Get current URL from window object
                const url = window.location.href;
    
                // Parse the URL using URL object (adjust for your route structure)
                const parsedUrl = new URL(url);
                const pathname = parsedUrl.pathname;
                const projectSegments = pathname.split('/'); // Split path segments
    
                // Extract project ID from the last segment (assuming it's at the end)
                const projectId = projectSegments[projectSegments.length - 1];
    
                if (!projectId) {
                    throw new Error('Project ID not found in URL');
                }
    
                return projectId;
            } catch (error) {
                console.error('Error getting project ID:', error);
                return null; // Or handle the error differently
            }
        }

        setOpenProject(getProjectIdFromUrl);
    }, []);
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
                <p className="text-sm opacity-50 sticky top-0 my-2">Projects</p>
                <ShowElement.when isTrue={projectsLoading === loadingState.SUCCESS && projectListDisplay.length > 0}>
                    {projectListDisplay.map((project) => (
                        <Project
                            key={project.project_id}
                            data={project}
                            isOpen={openProject}
                        />
                    ))}
                </ShowElement.when>

                <ShowElement.when isTrue={projectsLoading === loadingState.SUCCESS && projectListDisplay.length === 0}>
                    <span className="text-center opacity-60">You have no projects yet.</span>
                </ShowElement.when>
                <ShowElement.when isTrue={projectsLoading === loadingState.PENDING}>
                    <span className="text-center animate-pulse">
                        loading projects...
                    </span>
                </ShowElement.when>
                <ShowElement.when isTrue={projectsLoading === loadingState.FAILED}>    
                    <span className="text-center text-red-500">
                        {projectsError}
                    </span>
                </ShowElement.when>
            </div>
        </>
    );
}