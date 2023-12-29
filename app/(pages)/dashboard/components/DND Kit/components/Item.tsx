"use client"
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { FaEllipsis } from 'react-icons/fa6';

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
                'p-4 dark:bg-theme-white-dark bg-white shadow-md rounded-md w-full border border-transparent hover:border-theme-main/50 relative overflow-hidden',
                isDragging && 'rounded-none border-black opacity-25',
                !isDragging && 'dark:custom-radial-gradient',
            )}
        >
            <div className={clsx("flex flex-col gap-4", isDragging && 'opacity-0',)}>
                <div className="cursor-move absolute top-0 left-0 h-full w-full z-10" {...listeners}>

                </div>
                <div className='flex justify-between items-center px-3'>
                    <div className='cursor-pointer grid place-items-center h-6 w-6 rounded-full dark:bg-white/5 bg-black/5 relative z-20'>
                        🤞
                    </div>
                    <span className='cursor-pointer relative z-20'><FaEllipsis /></span>
                </div>
                <div className='z-[2] relative'>
                    <span className='text-theme-text font-semibold'>[{title}]</span> - Create a Prototype Mobile for Get Notification in Principle.
                </div>
            </div>
        </div>
    );
};

export default Items;