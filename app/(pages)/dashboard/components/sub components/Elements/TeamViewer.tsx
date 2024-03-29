"use client"
import React, { useMemo, useState } from "react";
import Filter from "./Team Viewer Elements/Filter";
import TeamList from "./Team Viewer Elements/TeamList";
import { UserAccountDetails } from "@/lib/Interfaces";
import { SortBy, ViewType } from "@/lib/Enums";
import { useSelector } from "react-redux";
import { echoDisplayList, echoTeamFromActiveProfile } from "@/Redux Store/Slices/profiles/team";
import { performSortingForTeamList } from "@/lib/functions";
import { TeamMember } from "@/lib/Types";

interface TeamContext {
    sortedList: UserAccountDetails[],
    displayList: UserAccountDetails[],
    setSearchResultList: React.Dispatch<React.SetStateAction<UserAccountDetails[]>>,
    viewType: ViewType,
    setViewType: React.Dispatch<React.SetStateAction<ViewType>>,
    sortBy: SortBy,
    setSortBy: React.Dispatch<React.SetStateAction<SortBy>>,
    teamList: UserAccountDetails[],
    companyTeamList: TeamMember[],
}

export const teamContext = React.createContext<TeamContext | undefined>(undefined);

export default function TeamViewer() {
    const companyTeamList = useSelector(echoTeamFromActiveProfile);
    const teamList = useSelector(echoDisplayList);
    const [displayList, setDisplayList] = useState<UserAccountDetails[]>([]);
    const [viewType, setViewType] = useState<ViewType>(ViewType.BOX);
    const [sortBy, setSortBy] = useState<SortBy>(SortBy.TYPE);
    const [searchResultList, setSearchResultList] = useState<UserAccountDetails[]>([]);

    useMemo(() => {
        setDisplayList(teamList);
    }, [teamList]);

    const sortedList =  useMemo(()=> {
        if (!searchResultList || !companyTeamList) return [];
        const copy = [...searchResultList];

        const performSorting = performSortingForTeamList(sortBy, copy, companyTeamList);
        return performSorting;
    }, [sortBy, searchResultList, companyTeamList]);

    return (
        <teamContext.Provider value={{ teamList, sortedList, setSearchResultList, viewType, setViewType, sortBy, setSortBy, displayList, companyTeamList }}>
            <Filter />
            <TeamList />
        </teamContext.Provider>
    )
}