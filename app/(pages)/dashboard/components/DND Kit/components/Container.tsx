import React from 'react';
import ContainerProps from '@/lib/Types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

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
                    <div className='w-7 h-7 grid place-items-center rounded bg-black dark:invert'>{itemsCount}</div>
                </div>
            </div>

            {children}
        </div>
    );
};

export default Container;