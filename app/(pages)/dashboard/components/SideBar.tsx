"use client";

import { FaAngleRight, FaPlus } from "react-icons/fa6";
import NameTag from "./sub components/side components/NameTag";
import { echoUserData, echoUserDataLoadingState } from "@/Redux Store/Slices/user data";
import { useSelector } from "react-redux";
import { loadingState, PopupType } from "@/lib/Enums";
import { useState } from "react";
import clsx from "clsx";
import ProjectList from "./sub components/side components/ProjectList";
import { echoTaskerProfilesError, echoTaskerProfilesLoading } from "@/Redux Store/Slices/profiles";
import ShowElement from "@/lib/utilities/Show";
import { echoTeamFromActiveProfile } from "@/Redux Store/Slices/profiles/team";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux Store";
import { openModal } from "@/Redux Store/Slices/Popup Slice";
import { echoProjectListResponse } from "@/Redux Store/Slices/profiles/projects";

export default function SideBar() {
    const loading = useSelector(echoUserDataLoadingState);
    const isTaskerProfilesLoading = useSelector(echoTaskerProfilesLoading);
    const taskerProfilesErrorMsg = useSelector(echoTaskerProfilesError);
    const companyTeamList = useSelector(echoTeamFromActiveProfile);
    const user = useSelector(echoUserData);
    const projectsList = useSelector(echoProjectListResponse);


    const dispatch = useDispatch<AppDispatch>();


    const [collapseSide, setCollapseSide] = useState(false);

    const newProject = () => {
        const popUpType: PopupType = PopupType.NewProject;
        dispatch(openModal({popUpType}));
    }

    return (
        <div className="relative group z-[40]">
            <section className={clsx(
                "h-screen flex flex-col gap-6 py-6 overflow-hidden shadow-md border-r border-transparent bg-white/5",
                collapseSide ? "w-0 opacity-10 p-1 group-hover:dark:border-white/10 group-hover:border-black/10" : "xl:w-[20rem] sm:w-[15rem] w-full p-4 dark:border-white/10 border-black/10"
            )}>
                <ShowElement.when isTrue={loading === loadingState.SUCCESS}>
                    <NameTag />
                </ShowElement.when>

                <div className="flex-1">
                    <ShowElement.when isTrue={isTaskerProfilesLoading === loadingState.SUCCESS}>
                        <ProjectList />
                    </ShowElement.when>

                    <ShowElement.when isTrue={isTaskerProfilesLoading === loadingState.PENDING}>
                        <span className="text-center animate-pulse">loading...</span>
                    </ShowElement.when>
                </div>
                <ShowElement.when isTrue={isTaskerProfilesLoading === loadingState.FAILED}>
                    <span className="text-center text-red-500">{taskerProfilesErrorMsg}</span>
                </ShowElement.when>
                <ShowElement.when 
                    isTrue={(companyTeamList.find((teamMember)=> teamMember.user_id === user.userData.userId)?.type === "editor" || companyTeamList.find((teamMember)=> teamMember.user_id === user.userData.userId)?.type === "owner")}
                >
                    <div className={clsx(
                        'opacity-60 hover:opacity-100 rounded-md peer-active:opacity-40 peer-active:scale-90 relative grid place-items-center px-6')}
                    >
                        <div 
                            onClick={newProject} 
                            className='h-[3rem] w-[3rem] rounded-full overflow-hidden grid place-items-center justify-center gap-2 text-lg hover:scale-105 active:scale-90 bg-theme-text text-theme-white cursor-pointer p-4'
                            title={`${projectsList.length> 0 ? "Add project": "Create your first project"}`}
                        >
                            <FaPlus />
                        </div>
                    </div>
                </ShowElement.when>

            </section>

            {/* Collapse Handle */}
            <div
                onClick={() => setCollapseSide(!collapseSide)}
                className={clsx(
                    "absolute group-hover:opacity-100 top-1/2 translate-y-1/2 -right-6 h-6 w-6 overflow-hidden rounded-r-full border border-theme-text grid place-items-center cursor-pointer hover:scale-125 active:scale-90",
                    collapseSide ? "" : "opacity-0"
                )}
                title={collapseSide ? "Expand sidebar" : "Collapse sidebar"}
            >
                <span className={clsx(
                    collapseSide ? "" : "rotate-180"
                )}>
                    <FaAngleRight />
                </span>
            </div>
        </div>
    )
}