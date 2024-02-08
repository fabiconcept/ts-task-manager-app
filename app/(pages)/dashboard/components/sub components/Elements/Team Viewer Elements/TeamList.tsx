"use client"
import clsx from "clsx";
import { useMemo } from "react"
import TeamMember from "./TeamMember";

export default function TeamList() {
    const gridViewMode = useMemo(() => {
        const boxView= "grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]";
        const listView= "grid-cols-1";

        return boxView;
    }, [])
    return (
        <section className={clsx(`grid ${gridViewMode} gap-4 p-4`)}>
            {Array.from({length: 6}).map((_, index)=>(
                <TeamMember key={index} />
            ))}
        </section>
    )
}