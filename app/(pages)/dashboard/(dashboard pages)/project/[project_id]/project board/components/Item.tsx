"use client"
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React, { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { FaEllipsis } from 'react-icons/fa6';
import { CiClock1 } from 'react-icons/ci';
import ActiveMember from '@/app/(pages)/dashboard/components/sub components/Elements/ActiveMember';

type ItemsType = {
    id: UniqueIdentifier;
    title: string;
};

const Items = ({ id, title }: ItemsType) => {
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

    const [openMenu, setOpenMenu] = useState<boolean>(false);

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
            }}
            className={clsx(
                'p-4 dark:bg-theme-white-dark/50 bg-theme-white/50 dark:shadow-md shadow-[0_5px_25px_rgb(0,0,0,0.25)] rounded-md w-full border border-theme-main/25 hover:border-theme-main/80 relative overflow-hidden',
                isDragging && 'rounded-none border-black opacity-25',
                !isDragging && 'dark:custom-radial-gradient custom-radial-gradient backdrop-blur',
            )}
        >
            <div className={clsx("flex flex-col gap-4", isDragging && 'opacity-0',)}>
                {/* Drag Handle */}
                <div className="cursor-move absolute top-0 left-0 h-full w-full z-10" {...listeners}>

                </div>
                {/* header content */}
                <div className='flex justify-between items-center'>
                    <div className='relative z-20 max-w-[90%] truncate text-xl font-semibold flex items-center gap-1 text-theme-main '>
                        Website Animation
                    </div>
                    <div className='relative z-60'>
                        <div className='relative z-10 cursor-pointer hover:bg-theme-text/50 bg-theme-text/5 active:scale-90 p-2 rounded-full' onClick={()=>setOpenMenu(!openMenu)}><FaEllipsis /></div>

                        <div className={clsx(
                            "origin-top-right absolute z-20 top-6 right-2 text-sm rounded-md p-2 dark:bg-theme-white-dark/90 bg-theme-white/90 grid gap-2 backdrop-blur",
                            !openMenu && "scale-0 opacity-0"
                        )}>
                            <div className='flex items-center gap-2 w-[6rem] px-2'>
                                <div className="content scale-75">
                                    <label className="checkBox">
                                        <input id="ch1" type="checkbox" />
                                        <div className="transition"></div>
                                    </label>
                                </div>
                                Edit
                            </div>
                            <div className='flex items-center gap-2 w-[6rem] px-2'>
                                <div className="content scale-75">
                                    <label className="checkBox">
                                        <input id="ch1" type="checkbox" />
                                        <div className="transition"></div>
                                    </label>
                                </div>
                                move
                            </div>
                            <div className='flex items-center gap-2 w-[6rem] px-2 text-red-600'>
                                Delete
                            </div>
                        </div>
                    </div>
                </div>

                
                {/* text content */}
                <div className='z-[2] relative flex flex-col'>
                    <span className='font-bold'>Details:</span>
                    <span className='opacity-70 font-semibold'>{title} Create a Prototype Mobile for Get Notification in Principle.</span>
                </div>

                {/* footer content */}
                <div className='items-center flex justify-between'>
                    <div className='p-1 flex items-center gap-1 text-sm bg-theme-text/25 rounded'>
                        <span><CiClock1 /></span>
                        <span>Mar 26</span>
                    </div>
                    <div className='flex'>
                        <div className='relative border-2 dark:border-theme-white-dark border-theme-white rounded-full'><ActiveMember type='small' key={1} /></div>
                        <div className='relative border-2 dark:border-theme-white-dark border-theme-white rounded-full -ml-3'><ActiveMember type='small' key={2} /></div>
                        <div className='relative border-2 dark:border-theme-white-dark border-theme-white rounded-full -ml-3'><ActiveMember type='small' key={3}/></div>
                        <div className='relative border-2 dark:border-theme-white-dark border-theme-white rounded-full -ml-3 aspect-square h-8 bg-gray-300 text-sm text-theme-white-dark grid place-items-center font-semibold'>5+</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Items;