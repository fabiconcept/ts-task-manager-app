import { UniqueIdentifier } from "@dnd-kit/core";
import { ContainerGroup } from "../Types";

function findValueOfItems(id: UniqueIdentifier | undefined, type: "container" | "item", containers:ContainerGroup[]) {
    if (type === 'container') {
        return containers.find((item) => item.id === id);
    }
    if (type === 'item') {
        return containers.find((container) =>
            container.items.find((item) => item.task_id === id),
        );
    }
}

const findItemTitle = (id: UniqueIdentifier | undefined, containers:ContainerGroup[]) => {
    const container = findValueOfItems(id, 'item', containers);
    if (!container) return '';
    const item = container.items.find((item) => item.task_id === id);
    if (!item) return '';
    return item.title;
};

export { findValueOfItems, findItemTitle }