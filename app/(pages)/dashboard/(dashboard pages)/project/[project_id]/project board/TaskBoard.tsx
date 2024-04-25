"use client"

import { DndContext, DragEndEvent, DragMoveEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import Container from "./components/Container";
import { ContainerGroup } from "@/lib/Types";
import Items from "./components/Item";
import { FaPlus } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux Store";
import { loadingState, PopupType, Priority, TaskerStatus } from "@/lib/Enums";
import { openModal } from "@/Redux Store/Slices/Popup Slice";
import ShowElement from "@/lib/utilities/Show";
import { findItemActiveItem, findValueOfItems } from "@/lib/DnD Helper";
import { useSelector } from "react-redux";
import { echoTasksListResponse, echoTasksListLoading, echoTasksListError, echoTasksListCurrentProject, echoTasksListUpdatingState, echoTasksListUpdatingError } from "@/Redux Store/Slices/profiles/projects/tasks";
import { $fetchProjectTasks } from "@/Redux Store/Thunk";
import { TaskerProjectTaskWithId } from "@/lib/Interfaces";
import { updateTaskerTeam } from "@/Redux Store/Slices/profiles/team";
import { echoTaskerProfilesActiveId, echoTaskerProfilesResponse } from "@/Redux Store/Slices/profiles";
import clsx from "clsx";

const emptyContainers: ContainerGroup[] = [
    {
        containerName: TaskerStatus.PENDING,
        id: `container-${TaskerStatus.PENDING}`,
        items: []
    },
    {
        containerName: TaskerStatus.INPROGRESS,
        id: `container-${TaskerStatus.INPROGRESS}`,
        items: []
    },
    {
        containerName: TaskerStatus.COMPLETE,
        id: `container-${TaskerStatus.COMPLETE}`,
        items: []
    },
]

export default function TaskBoard({ project_id }: { project_id: string }) {
    const dispatch = useDispatch<AppDispatch>();
    const [containers, setContainers] = useState<ContainerGroup[]>([
        {
            containerName: TaskerStatus.PENDING,
            id: `container-${TaskerStatus.PENDING}`,
            items: []
        },
        {
            containerName: TaskerStatus.INPROGRESS,
            id: `container-${TaskerStatus.INPROGRESS}`,
            items: []
        },
        {
            containerName: TaskerStatus.COMPLETE,
            id: `container-${TaskerStatus.COMPLETE}`,
            items: []
        },
    ]);
    const activeProfileId = useSelector(echoTaskerProfilesActiveId);

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const tasksList = useSelector(echoTasksListResponse);
    const tasksListLoading = useSelector(echoTasksListLoading);
    const tasksListError = useSelector(echoTasksListError);
    const tasksListCurrentProject = useSelector(echoTasksListCurrentProject);
    const tasksListUpdatingState = useSelector(echoTasksListUpdatingState);
    const tasksListUpdatingError = useSelector(echoTasksListUpdatingError);
    const { profiles } = useSelector(echoTaskerProfilesResponse);


    useEffect(() => {
        const activeProfile = profiles.find((profile) => profile.profile_id === activeProfileId);

        if (!activeProfile) return;

        dispatch(updateTaskerTeam({
            arr: activeProfile.team,
            id: activeProfile.owner
        }));

    }, [profiles, activeProfileId, dispatch]);

    const activeItem = useMemo(()=>{
        if(!activeId) return undefined;

        return findItemActiveItem(activeId, containers);
    }, [activeId, containers]);

    useEffect(() => {
        if(!project_id) return;

        dispatch($fetchProjectTasks(project_id));
    }, [dispatch, project_id]);

    useEffect(() => {
        if(tasksList.length === 0) return;
        
        if(tasksListCurrentProject !== project_id) {
            setContainers([...emptyContainers]);
            return;
        };

        setContainers((prev) => {
            const emptyItems: TaskerProjectTaskWithId[] = [];

            const newContainers = prev.map((container) => ({
                ...container,
                items: [...emptyItems], // Deep copy to avoid mutation
            }));

            tasksList.forEach((task) => {
                const itemWithId = { ...task, id: `item-${task.task_id}` };

                // Determine which container should get the task
                const targetContainer = newContainers.find((container) => {
                    return container.containerName === task.status;
                });

                if (targetContainer) {
                    // Check if the item already exists in the container to avoid duplicates
                    const itemExists = targetContainer.items.some(
                        (item) => item.task_id === task.task_id
                    );

                    if (!itemExists) {
                        targetContainer.items.push(itemWithId);
                    }
                }
            });

            return newContainers; // Return the updated containers array
        });
    }, [tasksList, tasksListCurrentProject, project_id]);

    // DND Handlers
    const sensors = useSensors(
        useSensor(PointerSensor), 
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates ,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const { id } = active;
        setActiveId(id);
    }
    
    const handleDragMove = (event: DragMoveEvent) => {
        const { active, over } = event;
    
        // Handle Items Sorting
        if (
          active.id.toString().includes('item') &&
          over?.id.toString().includes('item') &&
          active &&
          over &&
          active.id !== over.id
        ) {
          // Find the active container and over container
          const activeContainer = findValueOfItems(active.id, 'item', containers);
          const overContainer = findValueOfItems(over.id, 'item', containers);
    
          // If the active or over container is not found, return
          if (!activeContainer || !overContainer) return;
    
          // Find the index of the active and over container
          const activeContainerIndex = containers.findIndex(
            (container) => container.id === activeContainer.id,
          );
          const overContainerIndex = containers.findIndex(
            (container) => container.id === overContainer.id,
          );
    
          // Find the index of the active and over item
          const activeitemIndex = activeContainer.items.findIndex(
            (item) => item.id === active.id,
          );
          const overitemIndex = overContainer.items.findIndex(
            (item) => item.id === over.id,
          );
          // In the same container
          if (activeContainerIndex === overContainerIndex) {
            let newItems = [...containers];
            newItems[activeContainerIndex].items = arrayMove(
              newItems[activeContainerIndex].items,
              activeitemIndex,
              overitemIndex,
            );
    
            setContainers(newItems);
          } else {
            // In different containers
            let newItems = [...containers];
            const [removeditem] = newItems[activeContainerIndex].items.splice(
              activeitemIndex,
              1,
            );
            newItems[overContainerIndex].items.splice(
              overitemIndex,
              0,
              removeditem,
            );
            setContainers(newItems);
          }
        }
    
        // Handling Item Drop Into a Container
        if (
          active.id.toString().includes('item') &&
          over?.id.toString().includes('container') &&
          active &&
          over &&
          active.id !== over.id
        ) {
          // Find the active and over container
          const activeContainer = findValueOfItems(active.id, 'item', containers);
          const overContainer = findValueOfItems(over.id, 'container', containers);
    
          // If the active or over container is not found, return
          if (!activeContainer || !overContainer) return;
    
          // Find the index of the active and over container
          const activeContainerIndex = containers.findIndex(
            (container) => container.id === activeContainer.id,
          );
          const overContainerIndex = containers.findIndex(
            (container) => container.id === overContainer.id,
          );
    
          // Find the index of the active and over item
          const activeitemIndex = activeContainer.items.findIndex(
            (item) => item.id === active.id,
          );
    
          // Remove the active item from the active container and add it to the over container
          let newItems = [...containers];
          const [removeditem] = newItems[activeContainerIndex].items.splice(
            activeitemIndex,
            1,
          );
          newItems[overContainerIndex].items.push(removeditem);
          setContainers(newItems);
        }
      };
    
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        // Handling Container Sorting
        if (
            active.id.toString().includes('container') &&
            over?.id.toString().includes('container') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === active.id,
            );
            const overContainerIndex = containers.findIndex(
                (container) => container.id === over.id,
            );
            // Swap the active and over container
            let newItems = [...containers];
            newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
            setContainers(newItems);
        }

        // Handling item Sorting
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('item') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item', containers);
            const overContainer = findValueOfItems(over.id, 'item', containers);

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;
            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id,
            );
            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id,
            );
            const overitemIndex = overContainer.items.findIndex(
                (item) => item.id === over.id,
            );

            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                let newItems = [...containers];
                newItems[activeContainerIndex].items = arrayMove(
                    newItems[activeContainerIndex].items,
                    activeitemIndex,
                    overitemIndex,
                );
                setContainers(newItems);
            } else {
                // In different containers
                let newItems = [...containers];
                const [removeditem] = newItems[activeContainerIndex].items.splice(
                    activeitemIndex,
                    1,
                );
                newItems[overContainerIndex].items.splice(
                    overitemIndex,
                    0,
                    removeditem,
                );
                setContainers(newItems);
            }
        }
        // Handling item dropping into Container
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('container') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item', containers);
            const overContainer = findValueOfItems(over.id, 'container', containers);

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;
            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id,
            );
            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id,
            );

            let newItems = [...containers];
            const [removeditem] = newItems[activeContainerIndex].items.splice(
                activeitemIndex,
                1,
            );
            newItems[overContainerIndex].items.push(removeditem);
            setContainers(newItems);
        }
        setActiveId(null);
    }

    const openNewTaskModal = () => { 
        const popUpType: PopupType = PopupType.NewTask;
        dispatch(openModal({popUpType}));
    }

    return (
        <div className="mt-4 px-4 pb-4 flex flex-col gap-3">
            <div className="w-full flex justify-between items-end gap-4 px-2">
                <div className="flex gap-4 items-center text-sm">
                    <div className="flex gap-1 items-center">
                        <div className={clsx(
                            "h-2 w-2 bg-theme-main capitalize",
                            "-hue-rotate-[-170deg]",
                        )}></div>
                        <span className="opacity-70">{Priority.HIGH}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <div className={clsx(
                            "h-2 w-2 bg-theme-main capitalize",
                            "-hue-rotate-[-32deg]"
                        )}></div>
                        <span className="opacity-70">{Priority.MEDIUM}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <div className={clsx(
                            "h-2 w-2 bg-theme-main capitalize",
                            "-hue-rotate-[100deg]"
                        )}></div>
                        <span className="opacity-70">{Priority.LOW}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <div className={clsx(
                            "h-2 w-2 bg-theme-main capitalize",
                        )}></div>
                        <span className="opacity-70">{Priority.NONE}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <div className={clsx(
                            "h-2 w-2 bg-theme-main capitalize",
                            "grayscale"
                        )}></div>
                        <span className="opacity-70">Not for you</span>
                    </div>
                </div>
                <div onClick={openNewTaskModal} className="rounded-md py-3 px-6 border border-theme-main hover:border-transparent hover:bg-theme-main text-theme-main dark:hover:text-theme-white-dark active:scale-90 cursor-pointer flex items-center justify-center gap-2 active:opacity-50 hover:shadow-xl hover:shadow-white/10">
                    <FaPlus />
                    <span className={"font-semibold"}>New task</span>
                </div>
            </div>
            <ShowElement.when isTrue={tasksListUpdatingState === loadingState.FAILED}>
                <p className="text-red-600">{tasksListUpdatingError}</p>
            </ShowElement.when>
            <ShowElement.when isTrue={tasksListUpdatingState === loadingState.PENDING}>
                <p className="opacity-50 animate-pulse">Updating...</p>
            </ShowElement.when>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(clamp(20rem,30%,40rem),1fr))]">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={containers.map((container) => container.id)}>
                        {containers.map((container) => (
                            <Container description={""} key={container.id} id={container.id as string} groupName={container.containerName} itemsCount={container.items.length} >
                                <SortableContext items={container.items.map((i) => i.id)}>
                                    <div className="flex flex-col items-start gap-y-4">
                                        <ShowElement.when isTrue={container.items.length > 0}>
                                            {container.items.map((item) => (
                                                <Items taskItem={item} key={item.id} id={item.id} title={item.title} inGroup={container.containerName}/>
                                            ))}
                                        </ShowElement.when>
                                        <ShowElement.when isTrue={container.items.length === 0 && tasksListLoading === loadingState.SUCCESS}>
                                            <p className="px-8 text-xl font-thin opacity-10 text-center pointer-events-none w-full">No item</p>
                                        </ShowElement.when>
                                        <ShowElement.when isTrue={tasksListLoading === loadingState.PENDING}>
                                            <p className="px-8 text-lg opacity-20 text-center pointer-events-none w-full">
                                                <span className="animate-pulse">
                                                    loading items
                                                </span>
                                            </p>
                                        </ShowElement.when>
                                        <ShowElement.when isTrue={tasksListLoading === loadingState.FAILED}>
                                            <p className="px-8 text-lg opacity-80 text-center pointer-events-none w-full text-red-500">{tasksListError}</p>
                                        </ShowElement.when>
                                    </div>
                                </SortableContext>
                            </Container>
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {
                            activeId && activeId.toString().includes("item") && activeItem && (
                                <Items taskItem={activeItem} inGroup="avoid" key={activeId} id={activeId} title={activeItem.title} />
                            )
                        }
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}