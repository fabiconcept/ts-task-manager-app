"use client"
import clsx from "clsx";
import { useMemo } from "react"
import TeamMember from "./TeamMember";
import { useSelector } from "react-redux";
import { echoDisplayList, echoViewType } from "@/Redux Store/Slices/profiles/team/displayState";
import { ViewType } from "@/lib/Enums";
import { echoTaskerProfilesActiveId, echoTaskerProfilesResponse } from "@/Redux Store/Slices/profiles";
import { TaskerProfile } from "@/lib/Interfaces";

export default function TeamList() {
    const teamList = useSelector(echoDisplayList);
    const viewType = useSelector(echoViewType);
    const activeId = useSelector(echoTaskerProfilesActiveId);

    const { tags, profiles } = useSelector(echoTaskerProfilesResponse);

    const gridViewMode = useMemo(() => {
        const boxView= "grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]";
        const listView= "grid-cols-1";
        switch(viewType) {
            case ViewType.BOX: 
                return boxView;
            case ViewType.LIST: 
                return listView;
            default: 
                return boxView;
        }
    }, [viewType]);

    return (
        <section className={clsx(`grid ${gridViewMode} gap-4 p-4`)}>
            {teamList.map((member, index)=>(
                <TeamMember key={member.userId} data={member} />
            ))}
        </section>
    )
}