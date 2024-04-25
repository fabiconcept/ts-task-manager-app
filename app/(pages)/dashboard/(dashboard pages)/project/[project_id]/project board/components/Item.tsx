"use client"
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { FaEllipsis } from 'react-icons/fa6';
import { CiClock1 } from 'react-icons/ci';
import ActiveMember from '@/app/(pages)/dashboard/components/sub components/Elements/ActiveMember';
import { motion, useAnimation, Variants } from "framer-motion";
import { TaskerProjectTask } from '@/lib/Interfaces';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/Redux Store';
import { $updateTaskStatus } from '@/Redux Store/Thunk';
import { PutType, TaskerStatus, Priority } from '@/lib/Enums';
import { echoUserData } from '@/Redux Store/Slices/user data';
import { useSelector } from 'react-redux';
import ShowElement from '@/lib/utilities/Show';
import { echoDisplayList, echoTeamFromActiveProfile } from '@/Redux Store/Slices/profiles/team';

type ItemsType = {
    id: UniqueIdentifier;
    title: string;
    inGroup: string,
    taskItem: TaskerProjectTask
};

const Items = ({ id, title, inGroup, taskItem }: ItemsType) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'item',
        },
    });

    const getUserData = useSelector(echoUserData);

    const companyTeamList = useSelector(echoTeamFromActiveProfile);


    const dispatch = useDispatch<AppDispatch>();
    const [expanded, setExpanded] = useState<boolean>(false);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const controls = useAnimation();

    const expandRef = useRef<HTMLInputElement>(null);

    const variants: Variants = {
        open: { opacity: 1, height: "auto",  paddingLeft: "1rem", paddingRight: "1rem", paddingBlock: "1rem" },
        collapsed: { opacity: 0, height: 0,  paddingLeft: "0", paddingRight: "0", paddingBlock: "0" }
    }
    const framerTransition = {
        duration: 0.5,
        ease: [0.04, 0.62, 0.23, 0.98]
    }

    const isAssignedToUser = useMemo(()=>{
        if (!getUserData.userData.userId) return false;
        if (!taskItem.assigneeList.find((assignee) => assignee === getUserData.userData.userId)) return false;
        return true;
    }, [getUserData, taskItem]);

    const isEditor = useMemo(()=>{
        if (!getUserData.userData.userId) return false;
        
        if (!companyTeamList) return false;

        if (!taskItem.assigneeList.find((assignee) => assignee === getUserData.userData.userId)) return false;
        
        const findMember = companyTeamList.find((teamMemeber)=> teamMemeber.user_id === getUserData.userData.userId);

        if (!findMember) return false;

        if (findMember.type === "worker") return false;
        return true;
    }, [getUserData, taskItem, companyTeamList]);

    useEffect(() => {
        setExpanded(isAssignedToUser);
    }, [isAssignedToUser]);

    const handleToggle = () => {
        setExpanded(!expanded);
        setOpenMenu(false);
    }
    
    useEffect(() => {

        if(!inGroup) return;
        if(inGroup == "avoid") return;

        const tempWait = setTimeout(() => {
            if(inGroup == taskItem.status) return;
            dispatch($updateTaskStatus({taskId: taskItem.task_id, putType: PutType.STATUS, payload: inGroup as TaskerStatus}));
        }, 5000);

        return () => {
            clearTimeout(tempWait);
        }

    }, [inGroup, taskItem, dispatch]);

    useEffect(() => {
        if (expanded) {
            controls.start('open');
            return;
        }
        controls.start('collapsed');
    }, [expanded, controls]);


    return (
        <div
            ref={setNodeRef}
            {...attributes}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
            }}
            className={clsx(
                'bg-theme-main/5 dark:shadow-md shadow-[0_5px_25px_rgb(0,0,0,0.25)] rounded-md w-full border relative',
                isDragging && 'rounded-none border-black opacity-25',
                openMenu ? "z-10" : "",
                taskItem.priorityLevel === Priority.HIGH ? "-hue-rotate-[-200deg]" : "",
                taskItem.priorityLevel === Priority.LOW ? "-hue-rotate-[-32deg]" : "",
                taskItem.priorityLevel === Priority.MEDIUM ? "-hue-rotate-[100deg]" : "",
                !isDragging && 'dark:custom-radial-gradient custom-radial-gradient backdrop-blur',
                (isAssignedToUser || isEditor) ? " border-theme-main/25 hover:border-theme-main/80" : "border-theme-main/25 grayscale cursor-default",
            )}
        >
            <div className={clsx("flex flex-col", isDragging && 'opacity-0',)}>
                {/* Drag Handle */}
                <ShowElement.when isTrue={isAssignedToUser || isEditor}>
                    <div className="cursor-move absolute top-0 left-0 h-full w-full z-10" {...listeners}>
                    </div>
                </ShowElement.when>
                {/* header content */}
                <div className={clsx(
                    'flex justify-between items-center relative px-4',
                    expanded ? "border-b border-b-white/10 py-2 bg-black/25 rounded-t-md" : "py-4",
                )}>
                    <div className={clsx(
                        'relative z-20 text-xl font-semibold flex items-center gap-1 text-theme-main drop-shadow-md',
                        expanded ? "" : "text-white"                    
                    )}>
                        <p className="truncate">{title}</p> {!!isAssignedToUser && <>- <span className="opacity-50 text-sm text-white">For you</span></>}
                    </div>
                    
                    <div className='relative z-60'>
                        <div className='relative z-10 cursor-pointer border border-black hover:bg-theme-text/50 bg-theme-text/5 active:scale-90 p-2 rounded-full' onClick={()=>setOpenMenu(!openMenu)}><FaEllipsis /></div>

                        {/* Drop menu */}
                        <div className={clsx(
                            "origin-top-right absolute z-20 top-6 right-2 border border-white/30 text-sm rounded-md dark:bg-theme-white-dark/90 bg-theme-white/90 grid backdrop-blur",
                            !openMenu && "scale-0 opacity-0",
                            taskItem.priorityLevel === Priority.HIGH ? "-hue-rotate-[-170deg]" : "",
                            taskItem.priorityLevel === Priority.LOW ? "-hue-rotate-[-32deg]" : "",
                            taskItem.priorityLevel === Priority.MEDIUM ? "-hue-rotate-[100deg]" : "",
                        )}>
                            <div className='cursor-pointer flex items-center gap-2 px-4 py-2 active:opacity-50 active:scale-90 hover:bg-white/10 border-b border-b-white/5' onClick={()=>{expandRef.current?.click()}}>
                                <div className="content scale-75" title={expanded ? "Click to collapse" : "Click to expand"}>
                                    <label className="checkBox">
                                        <input id="ch1" type="checkbox" ref={expandRef} checked={expanded} onChange={handleToggle} />
                                        <div className="transition"></div>
                                    </label>
                                </div>
                                expand
                            </div>

                            <ShowElement.when isTrue={isEditor}>
                                <div className='cursor-pointer flex items-center gap-2 px-4 py-2 active:opacity-50 active:scale-90 hover:bg-white/10 border-b border-b-white/5'>
                                    Edit
                                </div>
                                <div className='cursor-pointer flex items-center gap-2 px-4 py-2 active:opacity-50 active:scale-90 hover:bg-white/10 font-semibold text-red-600'>
                                    Delete
                                </div>
                            </ShowElement.when>
                        </div>
                    </div>
                </div>

                <motion.div
                    className='flex flex-col gap-3 overflow-hidden'
                    initial="collapsed"
                    animate={controls}
                    variants={variants}
                    transition={framerTransition}
                >
                    {/* text content */}
                    <div className='z-[2] relative flex flex-col'>
                        <span className='opacity-70 font-semibold'>{taskItem.shortDesc}</span>
                    </div>

                    {/* footer content */}
                    <div className='items-center flex justify-between'>
                        <div className='p-1 px-2 flex items-center gap-1 text-sm bg-theme-text/50 rounded'>
                            <span><CiClock1 /></span>
                            <span>Mar 26</span>
                        </div>
                        <div className='flex'>
                            <Assignees activeUser={getUserData.userData.userId} assigneesList={taskItem.assigneeList} />
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Items;

interface AssigneeDisplay {
    userId: string;
    initials: string;
    avatar: string;
}

const Assignees = ({ assigneesList, activeUser }: { assigneesList: string[], activeUser: string }) =>{
    const teamList = useSelector(echoDisplayList);
    const [assigneeDisplayList, setAssigneeDisplayList] = useState<AssigneeDisplay[]>([]);

    useEffect(() => {
        if (!assigneesList || !teamList || !activeUser) return;

        const assignees: AssigneeDisplay[] = [];

        assigneesList.forEach((userId) => {
            if (userId !== activeUser) {
                const userDetails = teamList.find(
                    (user) => user.userId === userId
                );
                if (userDetails) {
                    assignees.push({
                        userId: userDetails.userId,
                        initials: userDetails.displayName
                            .split(" ")
                            .map((name) => name[0])
                            .join(""),
                        avatar: userDetails.profileAvatar,
                    });
                }
            }
        });

        const activeUserDetails = teamList.find((user) => user.userId === activeUser);
        if (activeUserDetails) {
            assignees.push({
                userId: activeUserDetails.userId,
                initials: activeUserDetails.displayName.split(" ").map((name) => name[0]).join(""),
                avatar: activeUserDetails.profileAvatar,
            });
        }

        setAssigneeDisplayList(assignees);
    }, [assigneesList, teamList, activeUser]);

    return (
        <>
            {assigneeDisplayList.slice(0, 3).map((assigneeItem)=>(    
                <div key={assigneeItem.userId} className='relative border-2 first:-ml-0 -ml-4 dark:border-theme-white-dark border-theme-white rounded-full'>
                    <ActiveMember type='small' avatar={assigneeItem.avatar} initials={assigneeItem.initials} />
                </div>
            ))}

            <ShowElement.when isTrue={assigneeDisplayList.length > 3}>
                <div className='relative border-2 dark:border-theme-white-dark border-theme-white rounded-full -ml-4 aspect-square h-8 bg-gray-300 text-sm text-theme-white-dark grid place-items-center font-semibold'>{assigneeDisplayList.length - 3}+</div>
            </ShowElement.when>

        </>
    )
}