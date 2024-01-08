"use client"
import StoreProvider from "@/Redux Store/Provider";
import SessionPolice from "./SessionPolice";
import { UiWithChildren } from "@/lib/Interfaces";

export default function ProviderWrapper({children}: UiWithChildren) {
    return (
        <StoreProvider>
            <SessionPolice />
            {children}
        </StoreProvider>
    )
}
