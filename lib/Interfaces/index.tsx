import { ItemType } from "../Types";

export interface DraggableElementProps {
    elements: ItemType[]; // Adjust the type here
    key: string;
    prefix: string;
}