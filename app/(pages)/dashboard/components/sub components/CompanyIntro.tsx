import { echoTaskerProfilesActiveId, echoTaskerProfilesResponse } from "@/Redux Store/Slices/profiles";
import { TaskerProfile } from "@/lib/Interfaces";
import { CompanyTag } from "@/lib/Types/dashboard";
import clsx from "clsx";
import Image from "next/image";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function CompanyIntro() {
    const activeId = useSelector(echoTaskerProfilesActiveId);
    const { tags, profiles } = useSelector(echoTaskerProfilesResponse);

    const company = useMemo((): [activeProfile: TaskerProfile, activeCompanyProfile: CompanyTag] | undefined => {
        const activeProfile = profiles.find((profile)=> profile.profile_id === activeId);
        const activeCompanyProfile = tags.find((tag)=> tag.id === activeId);

        if (!activeProfile || !activeCompanyProfile) return;

        return [activeProfile, activeCompanyProfile];
    }, [profiles, activeId, tags]);

    return (
        company  ? 
            <div className="w-full h-full relative">
            <div className={clsx(
                "absolute top-0 left-0 h-full w-full opacity-10 rounded-md grid place-items-center font-extrabold text-4xl",
                !company[1].avatar ? "bg-theme-main dark:text-theme-white-dark" : "bg-white"
            )}>
                {!company[1].avatar ?
                    `${company[1].abbr}.`
                    :
                    <div className="grid place-items-center h-full w-full overflow-hidden rounded">
                        <Image
                            src={company[1].avatar}
                            alt="spinner"
                            height={250}
                            width={250}
                            className="w-full min-h-full object-contain"
                        />
                    </div>}
            </div>

        </div> :
        <></>
    )
}