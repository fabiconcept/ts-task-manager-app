"use client"
import StoreProvider from "@/Redux Store/Provider";
import { UiWithChildren } from "@/lib/Interfaces";
import { ThemeProvider } from "next-themes"

export default function ProviderWrapper({ children }: UiWithChildren) {
    return (
        <StoreProvider>
            <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
            >
                {children}
            </ThemeProvider>
        </StoreProvider>
    )
}
