"use client"
import clsx from "clsx";
import { useContext, useMemo } from "react"
import TeamMember from "./TeamMember";
import { ViewType, loadingState } from "@/lib/Enums";
import { teamContext } from "../TeamViewer";
import Image from "next/image";
import TeamMemberLoading from "@/lib/loadingFrames/TeamMember";
import { echoTeamFromActiveProfileLoadingState, echoTeamFromActiveProfileErrorState } from "@/Redux Store/Slices/profiles/team";
import { useSelector } from "react-redux";
import ShowElement from "@/lib/utilities/Show";

export default function TeamList() {
    const { viewType, sortedList, displayList } = useContext(teamContext)!;
    const loading = useSelector(echoTeamFromActiveProfileLoadingState);
    const error = useSelector(echoTeamFromActiveProfileErrorState);

    const gridViewMode = useMemo(() => {
        const boxView= "grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]";
        const listView= "grid-cols-1";
        if(!(loading === loadingState.SUCCESS && sortedList.length)) return "grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]";
        switch(viewType) {
            case ViewType.BOX: 
                return boxView;
            case ViewType.LIST: 
                return listView;
            default: 
                return boxView;
        }
    }, [viewType, loading, sortedList.length]);

    return (
        <section className={clsx(`grid ${gridViewMode} gap-4 p-4 min-h-full`)}>
            {/* If team is Loaded and sortedList has content */}
            <ShowElement.when
                isTrue={loading === loadingState.SUCCESS && sortedList.length > 0}
            >
                {sortedList.map((member) => (
                    <TeamMember key={member.userId} data={member} />
                ))}
            </ShowElement.when>

            {/* If team is Loaded and sortedList doesn't have content */}
            <ShowElement.when
                isTrue={loading === loadingState.SUCCESS && sortedList.length === 0}
            >
                <div className={"h-full grid place-items-center p-24 gap-6"}>
                    <Image
                        src={"https://taskify.sirv.com/404.svg"}
                        alt=""
                        height={500}
                        width={500}
                        className="xl:w-[30rem] sm:w-[20rem] w-[15rem]"
                    />

                    <span className="md:text-base text-sm opacity-70">
                        {displayList.length === 0 ? "Your team list is empty." : "No result from search."}
                    </span>
                </div>
            </ShowElement.when>

            {/* If team is loading */}
            <ShowElement.when
                isTrue={loading === loadingState.PENDING}
            >
                {Array.from({ length: 5 }).map((_, index) => (
                    <TeamMemberLoading key={index} />
                ))}
            </ShowElement.when>
            
            {/* If an error occurs */}
            <ShowElement.when
                isTrue={loading === loadingState.FAILED}
            >
                <div className={"h-full grid place-items-center p-24 text-center text-lg dark:text-red-300 text-red-500"}>
                    <span>{error}</span>
                </div>
            </ShowElement.when>
        </section>
    )
}