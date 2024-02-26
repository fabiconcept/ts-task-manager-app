import { echoOwnerOfActiveProfile, echoTeamFromActiveProfile } from '@/Redux Store/Slices/profiles/team';
import { UserAccountDetails } from '@/lib/Interfaces';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { FaCrown, FaRegMessage, FaStar } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

export default function TeamMember({ data }: { data: UserAccountDetails }) {
    const companyTeamList = useSelector(echoTeamFromActiveProfile);
    const companyOwner = useSelector(echoOwnerOfActiveProfile);

    const type = useMemo(() => {
        const user = companyTeamList.find((member) => member.user_id === data.userId );
        const owner = (
            <>
                <span className='text-yellow-500'><FaCrown /></span>
                <span className='text-xs'>Owner</span>
            </>
        );
        const moderator = (
            <>
                <span className='text-blue-500'><FaStar /></span>
                <span className='text-xs'>moderator</span>
            </>
        );
        const member = (<span></span>);

        if (!user) return member;

        if (user.user_id === companyOwner) return owner;

        switch(user.type) {
            case "editor":
                return moderator;
            case "worker":
                return member;
            default:
                return member;
        }
    }, [companyTeamList, data.userId, companyOwner]);

    return (
        <div className='rounded-md dark:bg-white/5 bg-dark/5 h-[10rem] hover:dark:bg-white/20 hover:bg-dark/10 border-2 dark:border-white/50 hover:border-theme-text border-black/50 relative overflow-hidden'>
            <div className={clsx(
                "absolute top-0 left-0 h-full w-full opacity-10 rounded-md grid place-items-center font-extrabold text-4xl",
                !data.profileAvatar ? "bg-white/50 dark:text-theme-white-dark" : "bg-white"
            )}>
                {!data.profileAvatar ?
                    data.displayName
                    :
                    <div className="grid place-items-center h-full w-full overflow-hidden rounded">
                        <Image
                            src={data.profileAvatar}
                            alt={`${data.name}`}
                            height={250}
                            width={250}
                            className="w-full min-h-full object-contain"
                        />
                    </div>}
            </div>
            <div className='relative z-10 p-2 flex flex-col'>
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-1 capitalize cursor-text'>
                        {type}
                    </div>
                    <div className='flex items-center gap-1'>
                        <div className="flex items-center gap-1 active:gap-[0.1rem] cursor-pointer p-2 opacity-50 hover:opacity-100 active:opacity-40 active:scale-90">
                            <div className="h-1 w-1 rounded-full dark:bg-white bg-black"></div>
                            <div className="h-1 w-1 rounded-full dark:bg-white bg-black"></div>
                            <div className="h-1 w-1 rounded-full dark:bg-white bg-black"></div>
                        </div>
                        <span className='text-sm cursor-pointer active:opacity-40 active:scale-90 hover:scale-105'>
                            <FaRegMessage />
                        </span>
                    </div>
                </div>
                <div className='flex-1 peer cursor-pointer px-4 py-6 flex flex-col items-center gap-3'>
                    <div className='h-[4rem] w-[4rem] rounded-full overflow-hidden grid place-items-center border'>
                        <div className={clsx(
                            "h-full w-full rounded-md grid place-items-center",
                            !data.profileAvatar ? "bg-theme-main dark:text-theme-white-dark" : "bg-white"
                        )}>
                            {!data.profileAvatar ?
                                data.displayName
                                :
                                <div className="grid place-items-center h-full w-full overflow-hidden rounded">
                                    <Image
                                        src={data.profileAvatar}
                                        alt={`${data.name}`}
                                        height={250}
                                        width={250}
                                        className="w-full min-h-full object-contain"
                                    />
                                </div>}
                        </div>
                    </div>
                    <div className='max-w-full truncate text-sm font-semibold'>{data.name}</div>
                </div>
            </div>
        </div>
    )
}