"use client"
import { echoPopUpId, echoPopUpIsOpen, echoPopUpType } from "@/Redux Store/Slices/Popup Slice";
import ShowElement from "@/lib/utilities/Show";
import clsx from "clsx";
import { useSelector } from "react-redux";

export default function PopUpDiv() {
    const isOpen = useSelector(echoPopUpIsOpen);
    const popUpType = useSelector(echoPopUpType);
    const popUpId = useSelector(echoPopUpId);

    return (
        <>
            <ShowElement.when isTrue={!isOpen}>
                <section key={popUpId} className={clsx(
                    'fixed top-0 left-0 dark:bg-black/50 bg-white/50 backdrop-blur-sm z-[50] h-screen w-screen grid place-items-center',
                )}>
                    {popUpType}
                </section>
            </ShowElement.when>
        </>
    );
}