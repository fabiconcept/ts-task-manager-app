"use client"
import React, { useMemo, useState } from "react";
import Filter from "./Team Viewer Elements/Filter";
import TeamList from "./Team Viewer Elements/TeamList";
import { UserAccountDetails } from "@/lib/Interfaces";
import { SortBy, ViewType } from "@/lib/Enums";
import { useSelector } from "react-redux";
import { echoDisplayList } from "@/Redux Store/Slices/profiles/team";

interface TeamContext {
    displayList: UserAccountDetails[],
    setDisplayList: React.Dispatch<React.SetStateAction<UserAccountDetails[]>>,
    viewType: ViewType,
    setViewType: React.Dispatch<React.SetStateAction<ViewType>>,
    sortBy: SortBy,
    setSortBy: React.Dispatch<React.SetStateAction<SortBy>>,
    teamList: UserAccountDetails[],
}

export const teamContext = React.createContext<TeamContext | undefined>(undefined);

export default function TeamViewer() {
    const teamList = useSelector(echoDisplayList);
    const [displayList, setDisplayList] = useState<UserAccountDetails[]>([]);
    const [viewType, setViewType] = useState<ViewType>(ViewType.BOX);
    const [sortBy, setSortBy] = useState<SortBy>(SortBy.TYPE);

    useMemo(() => {
        setDisplayList(teamList);
    }, [teamList]);
    return (
        <teamContext.Provider value={{ teamList, displayList, setDisplayList, viewType, setViewType, sortBy, setSortBy }}>
            <Filter />
            <TeamList />
        </teamContext.Provider>
    )
}