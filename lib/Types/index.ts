import { UniqueIdentifier } from "@dnd-kit/core";

export type DNDType = {
    id: UniqueIdentifier;
    title: string;
    items: { id: UniqueIdentifier, title: string }[];
};

export default interface ContainerProps extends UiWithChildren {
    id: UniqueIdentifier;
    title?: string;
    description?: string;
    itemsCount: number;
    onAddItem?: () => void;
}