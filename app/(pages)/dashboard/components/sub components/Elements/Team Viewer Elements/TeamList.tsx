"use client"
import clsx from "clsx";
import { useContext, useMemo } from "react"
import TeamMember from "./TeamMember";
import { ViewType } from "@/lib/Enums";
import { teamContext } from "../TeamViewer";

export default function TeamList() {
    const { viewType, sortedList } = useContext(teamContext)!;

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
            {sortedList.map((member)=>(
                <TeamMember key={member.userId} data={member} />
            ))}
        </section>
    )
}