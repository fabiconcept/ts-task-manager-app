"use client"
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { FaEllipsis } from 'react-icons/fa6';
import { CiClock1 } from 'react-icons/ci';
import ActiveMember from '../../sub components/Elements/ActiveMember';

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
    return (
        <div
            ref={setNodeRef}
            {...attributes}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
            }}
            className={clsx(
                'p-4 dark:bg-theme-white-dark/50 bg-theme-white/50 shadow-md rounded-md w-full border border-transparent hover:border-theme-main/50 relative overflow-hidden',
                isDragging && 'rounded-none border-black opacity-25',
                !isDragging && 'dark:custom-radial-gradient',
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
                    <div className='relative z-60 mx-2'>
                        <div className='cursor-pointer hover:bg-theme-text/50 bg-theme-text/5 active:scale-90 p-2 rounded-full'><FaEllipsis /></div>
                        <div className="absolute z-20 top-5 right-3 rounded-md p-2 dark:bg-theme-white-dark/90 bg-theme-white/90">
                            <div className='flex items-center gap-2'>
                                <div className="content">
                                    <label className="checkBox">
                                        <input id="ch1" type="checkbox" />
                                        <div className="transition"></div>
                                    </label>
                                </div>
                                Edit
                            </div>
                        </div>
                    </div>
                </div>

                
                {/* text content */}
                <div className='z-[2] relative flex flex-col'>
                    <span className='font-semibold'>Details:</span>
                    <span className='opacity-60 text-sm'>{title} Create a Prototype Mobile for Get Notification in Principle.</span>
                </div>

                {/* footer content */}
                <div className='items-center flex justify-between'>
                    <div className='p-1 flex items-center gap-1 text-sm bg-theme-main/25 rounded'>
                        <span><CiClock1 /></span>
                        <span>Mar 26</span>
                    </div>
                    <div className='flex'>
                        <div className='relative border-2 border-theme-white-dark rounded-full'><ActiveMember type='small' key={1} /></div>
                        <div className='relative border-2 border-theme-white-dark rounded-full -ml-3'><ActiveMember type='small' key={2} /></div>
                        <div className='relative border-2 border-theme-white-dark rounded-full -ml-3'><ActiveMember type='small' key={3}/></div>
                        <div className='relative border-2 border-theme-white-dark rounded-full -ml-3 aspect-square h-8 bg-gray-300 text-sm text-theme-white-dark grid place-items-center font-semibold'>5+</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Items;