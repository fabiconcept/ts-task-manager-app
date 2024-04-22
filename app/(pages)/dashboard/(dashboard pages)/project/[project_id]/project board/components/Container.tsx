import React from 'react'; 
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

type ContainerProps = {
    id: string,
    children: React.ReactNode,
    title: string,
    description?: string,
    itemsCount: number,
    onAddItem?: ()=>{}
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
        transform,
        transition,
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
            title={description}
            className={clsx(
                'w-full h-full p-2 flex flex-col gap-y-4 border border-white/10 rounded-lg',
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center rounded-md justify-between p-2 dark:bg-white/10 bg-black/10 w-full">
                    <h1 className="font-semibold px-2 capitalize">{title}</h1>
                    <div className='w-7 h-7 grid place-items-center rounded text-white bg-black dark:invert'>{itemsCount}</div>
                </div>
            </div>

            {children}
        </div>
    );
};

export default Container;