"use client"
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import SearchFeature from "../../side components/SearchFeature";
import { FaArrowUpAZ } from "react-icons/fa6";
import { ViewType } from "@/lib/Enums";
import clsx from "clsx";
import { useContext } from "react";
import { teamContext } from "../TeamViewer";
import { performSearch } from "@/lib/functions";

export default function Filter() {
    const { setSortBy, setViewType, teamList, setDisplayList, viewType: viewMode } = useContext(teamContext)!;

    const handleSwitchToBoxView = () => {
        setViewType(ViewType.BOX)
    }
    
    const handleSwitchToListView = () => { 
        setViewType(ViewType.LIST)
    } 

    const handleSearchFeature = (searchParam: string) : void => { 
        if (!searchParam) return;

        const searchResults = performSearch(searchParam, teamList);
        setDisplayList(searchResults);
    }

    return (
        <div className="p-4 sticky top-0 backdrop-blur-md">
            <p className="py-3 opacity-60">Team members</p>
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
                    <span className="cursor-pointer hover:scale-110 active:scale-90 active:opacity-50" title="Sort by"><FaArrowUpAZ /></span>
                </div>
            </div>
        </div>
    )
}