import React from 'react'; 
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

type ContainerProps = {
    id: string,
    children: React.ReactNode,
    title: string,
    description: string,
    itemsCount: number,
    onAddItem: ()=>{}
}

const Container = ({
    id,
    children,
    title,
    description,
    itemsCount,
    onAddItem
}: ContainerProps) => {
    const {
        attributes,
        setNodeRef,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'container',
        },
    });
    return (
        <div
            {...attributes}
            ref={setNodeRef}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
            }}
            className={clsx(
                'w-full h-full p-4 flex flex-col gap-y-4',
                isDragging && 'opacity-50',
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center rounded-md justify-between p-2 dark:bg-white/10 bg-black/10 w-full">
                    <h1 className="font-semibold px-2">{title}</h1>
                    <div className='w-7 h-7 grid place-items-center rounded text-white bg-black dark:invert'>{itemsCount}</div>
                </div>
            </div>

            {children}
            {title === "Upcoming" && <div className='grid place-items-center dark:diagonal-gradient-dark font-semibold diagonal-gradient dark:bg-theme-white-dark/25 bg-theme-white/25 rounded-md active:scale-90 active:opacity-50 select-none cursor-pointer'>
                <span className='p-4 text-theme-text text-xl'>+ <span className='text-sm'>New</span></span>
            </div>}
        </div>
    );
};

export default Container;