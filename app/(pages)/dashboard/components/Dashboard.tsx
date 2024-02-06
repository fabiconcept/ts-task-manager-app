"use client"

import { echoTaskerProfilesActiveId, echoTaskerProfilesError, echoTaskerProfilesLoading, echoTaskerProfilesResponse } from "@/Redux Store/Slices/profiles";
import { loadingState } from "@/lib/Enums";
import { useSelector } from "react-redux";
import CompanyIntro from "./sub components/CompanyIntro";

export default function Dashboard() {
    const isLoading = useSelector(echoTaskerProfilesLoading);
    const errorMsg = useSelector(echoTaskerProfilesError);
    const { profiles } = useSelector(echoTaskerProfilesResponse);

    return (
        <>
            {isLoading === loadingState.PENDING && <div className="absolute h-full w-full dark:bg-black/80 bg-white/80 backdrop-blur-lg top-0 left-0 grid place-items-center">
                <span>loading</span>
            </div>}
            {(isLoading !== loadingState.SUCCESS || profiles.length === 0) && <div className="absolute h-full w-full backdrop-blur-lg top-0 left-0 grid place-items-center">
                <span>loading</span>
            </div>}
            {isLoading === loadingState.SUCCESS && profiles.length > 0 && <CompanyIntro />}
        </>
    );
}