import { UniqueIdentifier } from "@dnd-kit/core";
import React from "react";

export type DNDType = {
    id: UniqueIdentifier;
    title: string;
    items: { id: UniqueIdentifier, title: string }[];
};

export default interface ContainerProps {
    id: UniqueIdentifier;
    children: React.ReactNode;
    title?: string;
    description?: string;
    itemsCount: number;
    onAddItem?: () => void;
}