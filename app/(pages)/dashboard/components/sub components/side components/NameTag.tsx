"use client"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CompanyTag } from "@/lib/Types/dashboard";
import { echoUserData } from "@/Redux Store/Slices/user data";
import { useSelector } from "react-redux";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "@/lib/Types";
import { TaskerProfile } from "@/lib/Interfaces";

const dummyCompanys: CompanyTag[] = [
    { abbr: "G", username: "Google", avatar: "https://taskify.sirv.com/google-ico.png" },
    { abbr: "FB", username: "Facebook", avatar: "https://taskify.sirv.com/facebook-color.svg" },
]

export default function NameTag() {
    const [expandDiv, setExpandDiv] = useState(false);
    const { response } = useSelector(echoUserData);
    const [Companys, setCompanys] = useState<CompanyTag[]>([]);

    useEffect(() => {
        const { userData } = response;
        if (userData.projects.length === 0) {
            return;
        }
        const taskerProfile = userData.projects;
        
        const taskerProfileIds = taskerProfile.map((profile)=> profile.profile_id);

        async function fetchProfiles() {
            const sendRequest = await fetch("/api/dashboard/taskerProfiles", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({key: taskerProfileIds}),
            });

            const data: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<TaskerProfile[]> = await sendRequest.json();

            const { status, message } = data;

            if (status === 200) {
                const myTaskerProfiles = (data.data).map((profile)=> {
                    const companyProfile: CompanyTag = {
                        abbr: (profile.name).split("").splice(0, 2).join(""),
                        username: profile.name,
                        avatar: profile.avatar
                    }

                    return companyProfile;
                });

                setCompanys([...myTaskerProfiles, ...dummyCompanys]);
            }


        }
        fetchProfiles();
    }, [response]);

    return (
        <section className="h-[3.15rem] relative z-50">
            <div className={clsx(
                "rounded-md grid overflow-hidden transition-[height] bg-white/10 text-sm cursor-pointer dark:shadow-[0_2.5px_25px_rgba(255,255,255,0.05)] hover:dark:shadow-[0_2.5px_25px_rgba(255,255,255,0.1)] shadow-[0_2.5px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_2.5px_25px_rgba(0,0,0,0.1)] border dark:border-white/10 border-black/10 backdrop-blur",
                expandDiv ? "h-[9.25rem]" : "h-[3.15rem]"
            )}>
                {/*  */}

                {dummyCompanys.map((company, index) => {
                    if (index === 0) {
                        return (
                            <div key={company.username} className="flex gap-3 items-center py-2 px-3 active:scale-90 hover:bg-white/25" onClick={() => setExpandDiv(!expandDiv)}>
                                <div className="h-8 w-8 bg-theme-main dark:text-theme-white-dark rounded-md grid place-items-center font-bold">
                                    {!company.avatar ?
                                        `${company.abbr}.`
                                        :
                                        <div className="grid place-items-center h-full w-full overflow-hidden rounded">
                                            <Image
                                                src={"https://taskify.sirv.com/cac029af-9f80-4e21-94fb-5770339b32eb.jpg"}
                                                alt="spinner"
                                                height={250}
                                                width={250}
                                                className="w-full min-h-full object-contain"
                                            />
                                        </div>}
                                </div>
                                <span className="flex-1 select-none truncate">{company.username}</span>
                                <span className="flex flex-col text-xs pr-2">
                                    <span className={clsx(
                                        expandDiv ? "-mb-5" : ""
                                    )}><FaAngleUp /></span>
                                    <span className={clsx(
                                        expandDiv ? "-mt-1" : ""
                                    )}><FaAngleDown /></span>
                                </span>
                            </div>
                        )
                    }else {
                        return (
                            <div
                        key={company.username}
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