import { UniqueIdentifier } from "@dnd-kit/core";
import { DNDType } from "../Types";

function findValueOfItems(id: UniqueIdentifier | undefined, type: "container" | "item", containers:DNDType[]) {
    if (type === 'container') {
        return containers.find((item) => item.id === id);
    }
    if (type === 'item') {
        return containers.find((container) =>
            container.items.find((item) => item.id === id),
        );
    }
}

const findItemTitle = (id: UniqueIdentifier | undefined, containers:DNDType[]) => {
    const container = findValueOfItems(id, 'item', containers);
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.title;
};

export { findValueOfItems, findItemTitle }