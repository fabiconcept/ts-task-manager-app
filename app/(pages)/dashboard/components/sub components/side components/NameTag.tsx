"use client"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CompanyTag } from "@/lib/Types/dashboard";
import { echoUserData } from "@/Redux Store/Slices/user data";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchProfiles } from "@/Redux Store/Thunk";
import { AppDispatch } from "@/Redux Store";
import { echoTaskerProfilesActiveId, echoTaskerProfilesError, echoTaskerProfilesLoading, echoTaskerProfilesResponse, switchProfile } from "@/Redux Store/Slices/profiles";
import { loadingState } from "@/lib/Enums";
import { sortByMatchingId } from "@/lib/utilities";

export default function NameTag() {
    const dispatch = useDispatch<AppDispatch>();
    const [expandDiv, setExpandDiv] = useState(false);
    const { response } = useSelector(echoUserData);
    const isLoading = useSelector(echoTaskerProfilesLoading);
    const errorMsg = useSelector(echoTaskerProfilesError);
    const activeId = useSelector(echoTaskerProfilesActiveId);
    const { tags } = useSelector(echoTaskerProfilesResponse);
    const [Companys, setCompanys] = useState<CompanyTag[]>([]);

    useEffect(() => {
        const { userData } = response;
        if (userData.projects.length === 0) {
            return;
        }
        const taskerProfile = userData.projects;
        const taskerProfileIds = taskerProfile.map((profile) => profile.profile_id);

        dispatch(fetchProfiles(taskerProfileIds));
    }, [response, dispatch]);

    useEffect(() => {
        if (isLoading !== loadingState.SUCCESS) return;
        const data = sortByMatchingId(tags, activeId);
        setCompanys([...data]);
    }, [tags, activeId, isLoading]);

    const handleCollapse =() => {
        if (Companys.length < 2) return; 
        setExpandDiv(!expandDiv);
    }

    const switchTaskerProfile = (id: string) => {
        handleCollapse();
        dispatch(switchProfile(id));
        return;
    }

    return (
        <section className="h-[3.15rem] relative z-50">
            <div className={clsx(
                "rounded-md grid overflow-hidden transition-[max-height] bg-white/10 text-sm dark:shadow-[0_2.5px_25px_rgba(255,255,255,0.05)] hover:dark:shadow-[0_2.5px_25px_rgba(255,255,255,0.1)] shadow-[0_2.5px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_2.5px_25px_rgba(0,0,0,0.1)] border dark:border-white/10 border-black/10 backdrop-blur",
                expandDiv ? "max-h-[15rem]" : "max-h-[3.1rem]",
                !(isLoading === loadingState.SUCCESS) ? "cursor-not-allowed" : "cursor-pointer"
            )}>
                {/*  */}

                {!(isLoading === loadingState.SUCCESS) && <div title={`${errorMsg}`} className="flex gap-3 items-center py-2 px-3 active:scale-90 hover:bg-white/25">
                    <div className={clsx(
                        "h-8 w-8 dark:text-theme-white-dark rounded-md grid place-items-center font-bold",
                        "bg-theme-main dark:text-theme-white-dark"
                    )
                    }>
                        <Image
                            src={"https://taskify.sirv.com/spinner.svg"}
                            alt="spinner"
                            height={100}
                            width={100}
                            className="w-6 invert"
                        />
                    </div>
                    <span className="flex-1 select-none truncate animate-pulse">loading</span>
                </div>
                }

                {isLoading === loadingState.SUCCESS && Companys.map((company, index) => {
                    if (index === 0) {
                        return (
                            <div 
                                key={company.id} 
                                className={clsx(
                                    "flex gap-3 items-center py-2 px-3 hover:bg-white/25",
                                    Companys.length > 1 ? "active:scale-90" : ""
                                )} 
                                onClick={handleCollapse}
                            >
                                <div className={clsx(
                                    "h-8 w-8 dark:text-theme-white-dark rounded-md grid place-items-center font-bold",
                                    !company.avatar ? "bg-theme-main dark:text-theme-white-dark" : "bg-white"
                                )
                                }>
                                    {!company.avatar ?
                                        `${company.abbr}.`
                                        :
                                        <div className="grid place-items-center h-full w-full overflow-hidden rounded">
                                            <Image
                                                src={company.avatar}
                                                alt="spinner"
                                                height={250}
                                                width={250}
                                                className="w-full min-h-full object-contain"
                                            />
                                        </div>}
                                </div>
                                <span className="flex-1 select-none truncate">{company.username}</span>
                                {!!(Companys.length > 1) && <span className="flex flex-col text-xs pr-2">
                                    <span className={clsx(
                                        expandDiv ? "-mb-5" : ""
                                    )}><FaAngleUp /></span>
                                    <span className={clsx(
                                        expandDiv ? "-mt-1" : ""
                                    )}><FaAngleDown /></span>
                                </span>}
                            </div>
                        )
                    } else {
                        return (
                            <div
                                key={company.id}
                                onClick={() => switchTaskerProfile(company.id)}
                                className="flex gap-3 items-center py-2 px-3 active:scale-90 hover:bg-white/25"
                            >
                                <div className={clsx(
                                    "h-8 w-8 rounded-md grid place-items-center font-bold",
                                    !company.avatar ? "bg-theme-main dark:text-theme-white-dark" : "bg-white"
                                )}>
                                    {!company.avatar ?
                                        `${company.abbr}.`
                                        :
                                        <div className="grid place-items-center h-full w-full overflow-hidden rounded">
                                            <Image
                                                src={company.avatar}
                                                alt="spinner"
                                                height={250}
                                                width={250}
                                                className="w-full min-h-full object-contain"
                                            />
                                        </div>}
                                </div>
                                <span className="flex-1 select-none truncate">{company.username}</span>
                            </div>
                        )
                    }
                })}
            </div>

        </section>
    )
}