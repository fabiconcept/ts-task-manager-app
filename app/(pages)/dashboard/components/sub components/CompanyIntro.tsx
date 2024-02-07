import { echoTaskerProfilesActiveId, echoTaskerProfilesResponse } from "@/Redux Store/Slices/profiles";
import { echoUserData } from "@/Redux Store/Slices/user data";
import { TaskerProfile } from "@/lib/Interfaces";
import { CompanyTag } from "@/lib/Types/dashboard";
import clsx from "clsx";
import Image from "next/image";
import { useMemo } from "react";
import { FaUserGroup, FaXmark } from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function CompanyIntro() {
    const activeId = useSelector(echoTaskerProfilesActiveId);
    const { response } = useSelector(echoUserData);
    const { tags, profiles } = useSelector(echoTaskerProfilesResponse);

    const company = useMemo((): [activeProfile: TaskerProfile, activeCompanyProfile: CompanyTag] | undefined => {
        const activeProfile = profiles.find((profile) => profile.profile_id === activeId);
        const activeCompanyProfile = tags.find((tag) => tag.id === activeId);

        if (!activeProfile || !activeCompanyProfile) return;

        return [activeProfile, activeCompanyProfile];
    }, [profiles, activeId, tags]);

    const isOwner = useMemo(() => {
        if (!company) {
            return false;
        }

        return response.userData.userId === company[0].owner;
    }, [response, company]);

    return (
        company ?
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

                <section className="relative z-10 backdrop-blur-lg h-full w-full rounded-md">
                    <div className="flex flex-col">
                        <div className="w-full flex items-center p-6 justify-between backdrop-blur-md  border-b dark:border-b-white/20 border-b-black/20">
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "h-16 w-16 shadow rounded-full grid place-items-center font-extrabold text-4xl",
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
                                <div className="grid">
                                    <p className="text-lg font-semibold flex items-center gap-2">
                                        {company[0].name}
                                        <Image
                                            src={"https://taskify.sirv.com/verified-account.png"}
                                            alt="verified"
                                            height={50}
                                            width={50}
                                            className="w-4 h-4 object-contain"
                                        />

                                    </p>
                                    <p className="opacity-60 text-sm">@{company[0].profile_id}</p>
                                </div>
                            </div>

                            {!isOwner && <div title={`Exit ${company[0].name}`} className="flex items-center gap-2 px-4 p-2 opacity-60 hover:opacity-100 hover:scale-110 active:scale-90 active:opacity-50 cursor-pointer rounded-3xl border border-transparent hover:border-red-500">
                                <FaXmark /> leave
                            </div>}
                        </div>
                        <div className="p-4 flex items-start justify-center border-b dark:border-b-white/20 border-b-black/20 dark:bg-black/30 bg-white/30">
                            <div className="flex flex-col px-6 items-center  border-r dark:border-r-white/20 border-r-black/20">
                                <span className="text-sm opacity-70 text-theme-text">Team Size</span>
                                <span className="text-2xl">{company[0].teamCount ?? 0}</span>
                            </div>
                            <div className="flex flex-col px-6 items-center">
                                <span className="text-sm opacity-70 text-theme-text">Projects</span>
                                <span className="text-2xl">{company[0].projectsCount ?? 0}</span>
                            </div>
                        </div>

                    </div>
                </section>
            </div> :
            <></>
    )
}