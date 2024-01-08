"use client"
import StoreProvider from "@/Redux Store/Provider";
import { UiWithChildren } from "@/lib/Interfaces";

export default function ProviderWrapper({children}: UiWithChildren) {
    return (
        <StoreProvider>
            {children}
        </StoreProvider>
    )
}
