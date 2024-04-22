"use client"
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import SearchFeature from "../../side components/SearchFeature";
import { FaArrowDownWideShort, FaArrowUpAZ, FaArrowUpZA, FaSort } from "react-icons/fa6";
import { SortBy, ViewType } from "@/lib/Enums";
import clsx from "clsx";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { teamContext } from "../TeamViewer";
import { performSearch, toggleSortBy } from "@/lib/functions";

export default function Filter() {
    const { setSortBy, setViewType, teamList, setSearchResultList, viewType: viewMode, sortBy } = useContext(teamContext)!;

    const sortByOptions: SortBy[] = [SortBy.TYPE, SortBy.AZ, SortBy.ZA, SortBy.JOIN];

    const sortIcon = useMemo(() => {
        switch (sortBy) {
            case SortBy.AZ:
                return <FaArrowUpAZ />;
            case SortBy.JOIN:
                return <FaArrowDownWideShort />;
            case SortBy.ZA:
                return <FaArrowUpZA />;
            default:
                return <FaSort />;
        }
    }, [sortBy]);

    const handleSwitchToBoxView = () => {
        setViewType(ViewType.BOX);
    }
    
    const handleSwitchToListView = () => { 
        setViewType(ViewType.LIST);
    } 

    const handleSearchFeature = useCallback((searchParam: string) : void => { 
        const searchResults = performSearch(searchParam, teamList);
        setSearchResultList(searchResults);
    }, [teamList, setSearchResultList]);

    const handleToggleSortBy = () => {
        const currentSortByType = sortByOptions.findIndex((option) => option === sortBy)!;
        const nextSortBy = toggleSortBy(currentSortByType);
        setSortBy(sortByOptions[nextSortBy]);
    }

    return (
        <div className="p-4 sticky top-0 z-20 backdrop-blur-md dark:bg-theme-white-dark bg-theme-white">
            <p className="pb-2 opacity-60">Team members</p>
            <div className="flex items-center gap-4 ">
                <div className="flex-1">
                    <SearchFeature
                        performFunction={handleSearchFeature}
                        placeholder="search by username"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span onClick={handleSwitchToBoxView} className={clsx(
                        "cursor-pointer hover:scale-110 active:scale-90 active:opacity-50",
                        viewMode === ViewType.BOX ? "opacity-100 scale-125" : "opacity-50"
                    )} title="Box view"><CiGrid41 /></span>
                    <span onClick={handleSwitchToListView} className={clsx(
                        "cursor-pointer hover:scale-110 active:scale-90 active:opacity-50",
                        viewMode === ViewType.LIST ? "opacity-100 scale-125" : "opacity-50"
                    )} title="List view"><CiGrid2H /></span>
                    <span 
                        className="cursor-pointer hover:scale-110 active:scale-90 active:opacity-50" 
                        title={`Sort by ${sortBy}`}
                        onClick={handleToggleSortBy}
                    >
                        {sortIcon}
                    </span>
                </div>
            </div>
        </div>
    )
}