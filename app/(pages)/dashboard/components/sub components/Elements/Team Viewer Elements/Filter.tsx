"use client"
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import SearchFeature from "../../side components/SearchFeature";
import { FaArrowUpAZ } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { updateViewType } from "@/Redux Store/Slices/profiles/team/displayState";
import { ViewType } from "@/lib/Enums";

export default function Filter() {
    const dispatch = useDispatch();

    const handleSwitchToBoxView = () => {
        dispatch(updateViewType(ViewType.BOX));
    }
    
    const handleSwitchToListView = () => { 
        dispatch(updateViewType(ViewType.LIST));
     }

    return (
        <div className="p-4 sticky top-0 backdrop-blur-md">
            <p className="py-3 opacity-60">Team members</p>
            <div className="flex items-center gap-4 ">
                <div className="flex-1">
                    <SearchFeature
                        performFunction={() => { }}
                        placeholder="search by username"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span onClick={handleSwitchToBoxView} className="cursor-pointer hover:scale-110 active:scale-90 active:opacity-50" title="Box view"><CiGrid41 /></span>
                    <span onClick={handleSwitchToListView} className="cursor-pointer hover:scale-110 active:scale-90 active:opacity-50" title="List view"><CiGrid2H /></span>
                    <span className="cursor-pointer hover:scale-110 active:scale-90 active:opacity-50" title="Sort by"><FaArrowUpAZ /></span>
                </div>
            </div>
        </div>
    )
}