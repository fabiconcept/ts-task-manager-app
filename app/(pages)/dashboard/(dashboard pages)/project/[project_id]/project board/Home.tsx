"use client"

import { DndContext, DragEndEvent, DragMoveEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import Container from "./components/Container";
import { ContainerGroup } from "@/lib/Types";
import Items from "./components/Item";
import { FaPlus } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux Store";
import { loadingState, PopupType, TaskerStatus } from "@/lib/Enums";
import { openModal } from "@/Redux Store/Slices/Popup Slice";
import ShowElement from "@/lib/utilities/Show";
import { findItemTitle, findValueOfItems } from "@/lib/DnD Helper";
import { useSelector } from "react-redux";
import { echoTasksListResponse, echoTasksListLoading, echoTasksListError } from "@/Redux Store/Slices/profiles/projects/tasks";

export default function Home() {
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
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const tasksList = useSelector(echoTasksListResponse);
    const tasksListLoading = useSelector(echoTasksListLoading);
    const tasksListError = useSelector(echoTasksListError);

    useEffect(() => {
        if(tasksList.length === 0) return;

        setContainers((prev) => {
            const tempContainers = prev;

            tasksList.forEach((task) => {
                switch (task.status) {
                    case TaskerStatus.PENDING:
                        tempContainers[0].items.push({...task, id: `item-${task.task_id}`});
                        break;
                    case TaskerStatus.INPROGRESS:
                        tempContainers[1].items.push({...task, id: `item-${task.task_id}`});
                        break;
                    case TaskerStatus.COMPLETE:
                        tempContainers[2].items.push({...task, id: `item-${task.task_id}`});
                        break;

                    default:
                        tempContainers[0].items.push({...task, id: `item-${task.task_id}`});
                        break;
                }
            })

            return tempContainers;
        });
    }, [tasksList]);

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
            <div className="w-full flex justify-end px-2">
                <div onClick={openNewTaskModal} className="rounded-md py-3 px-6 border border-theme-main hover:border-transparent hover:bg-theme-main text-theme-main dark:hover:text-theme-white-dark active:scale-90 cursor-pointer flex items-center justify-center gap-2 active:opacity-50 hover:shadow-xl hover:shadow-white/10">
                    <FaPlus />
                    <span className={"font-semibold"}>New task</span>
                </div>
            </div>
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
                                                <Items key={item.id} id={item.id} title={item.title} />
                                            ))}
                                        </ShowElement.when>
                                        <ShowElement.when isTrue={container.items.length === 0 && tasksListLoading === loadingState.SUCCESS}>
                                            <p className="px-8 text-xl font-thin opacity-10 text-center pointer-events-none w-full">No item</p>
                                        </ShowElement.when>
                                        <ShowElement.when isTrue={tasksListLoading === loadingState.PENDING}>
                                            <p className="px-8 text-lg opacity-20 text-center pointer-events-none w-full">
                                                <span className="animate-pulse">
                                                    ...loading items...
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
                            activeId && activeId.toString().includes("item") && (
                                <Items key={activeId} id={activeId} title={findItemTitle(activeId, containers)} />
                            )
                        }
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}