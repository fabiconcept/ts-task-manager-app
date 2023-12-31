"use client"

import { DndContext, DragEndEvent, DragMoveEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import Container from "./components/Container";
import { DNDType } from "@/lib/Types";
import Items from "./components/Item";

export default function Home() {
    const [containers, setContainers] = useState<DNDType[]>([
        {
            id: `container-0fe1ec50-5ee6-55a4-8902-0dab6183acab`,
            title: "Upcoming",
            items: [
                {
                    id: `item-d88525db-2917-554d-b7b5-042275252475`,
                    title: "Item 1"
                },
            ]
        },
        {
            id: `container-06ab7ac8-25e1-5e69-a937-c76f43112351`,
            title: "Pending",
            items: [
                {
                    id: `item-54090e9c-dd95-5839-8561-d1a2b0b2285c`,
                    title: "Item 2"
                },
            ]
        },
        {
            id: `container-06ab7ac8-25e1-5e69-a937-df`,
            title: "Complete",
            items: [
                {
                    id: `item-54090e9c-dd95-5839-8561-sd`,
                    title: "Item 3"
                },
            ]
        },
    ]);
    const [activeId,setActiveId] = useState<UniqueIdentifier | null>(null);
    const [containerId, setContainerId] = useState<UniqueIdentifier>();
    const [containerName, setContainerName] =useState("");
    const [itemName, setItemName] = useState("");
    const [showAddItemModal, setShowAddItemModal] = useState(false); 

    // Helper function 
    function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
        if (type === 'container') {
            return containers.find((item) => item.id === id);
        }
        if (type === 'item') {
            return containers.find((container) =>
                container.items.find((item) => item.id === id),
            );
        }
    }

    const findItemTitle = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'item');
        if (!container) return '';
        const item = container.items.find((item) => item.id === id);
        if (!item) return '';
        return item.title;
    };

    const findContainerTitle = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'container');
        if (!container) return '';
        return container.title;
    };

    const findContainerItems = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'container');
        if (!container) return [];
        return container.items;
    };
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
          const activeContainer = findValueOfItems(active.id, 'item');
          const overContainer = findValueOfItems(over.id, 'item');
    
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
          const activeContainer = findValueOfItems(active.id, 'item');
          const overContainer = findValueOfItems(over.id, 'container');
    
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
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'item');

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
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'container');

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

    return (
        <div className="mt-10">
            <div className="grid grid-cols-3">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={containers.map((container) => container.id)}>
                        {containers.map((container) => (
                            <Container key={container.id} id={container.id} title={container.title} itemsCount={container.items.length} onAddItem={()=>{}}>
                                <SortableContext items={container.items.map((i) => i.id)}>
                                    <div className="flex flex-col items-start gap-y-4">
                                        {container.items.map((item) => (
                                            <Items key={item.id} id={item.id} title={item.title} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </Container>
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {
                            activeId && activeId.toString().includes("item") && (
                                <Items key={activeId} id={activeId} title={findItemTitle(activeId)} />
                            )
                        }
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}