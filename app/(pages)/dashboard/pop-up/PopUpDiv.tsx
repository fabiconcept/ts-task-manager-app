"use client"
import { closeModal, echoPopUpId, echoPopUpIsOpen, echoPopUpType } from "@/Redux Store/Slices/Popup Slice";
import ShowElement from "@/lib/utilities/Show";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux Store";
import { useState, createContext, Dispatch, SetStateAction } from "react";
import { PopupType } from "@/lib/Enums";
import NewProjectForm from "./forms/NewProjectForm";
import InviteTeammate from "./forms/InviteTeammate";

interface PopContext  {
    setCanClose: Dispatch<SetStateAction<boolean>>,
    handleCloseModal: () => void,
}

export const popContext = createContext<PopContext | undefined>(undefined);

export default function PopUpDiv() {
    const isOpen = useSelector(echoPopUpIsOpen);
    const popUpType = useSelector(echoPopUpType);
    const popUpId = useSelector(echoPopUpId);
    const [canClose, setCanClose] = useState<boolean>(true);
    const [modalState, setModalState] = useState(true);

    const dispatch = useDispatch<AppDispatch>();


    const handleCloseModal = () => {
        if (!canClose) return;
        
        setModalState(false);
        setTimeout(() => {
            dispatch(closeModal());
            setModalState(true);
        }, 300);
    }

    return (
        <popContext.Provider value={{setCanClose, handleCloseModal}}>
            <ShowElement.when isTrue={isOpen}>
                <section key={popUpId} className={clsx(
                    'fixed top-0 left-0 z-[50] h-screen w-screen grid place-items-center dark:bg-black/50 bg-white/50 backdrop-blur-sm',
                    modalState ? "dark:bg-black/50 bg-white/50": "dark:bg-black/0 bg-white/0"
                )}>
                    <div className="absolute top-6 left-6 z-10 cursor-pointer h-full w-full" onClick={handleCloseModal}>
                    </div>
                    <div className={clsx(
                        "absolute z-20 sm:top-0 sm:bottom-auto sm:right-0 sm:h-full top-auto bottom-0 right-1/2 -translate-x-1/2 h-[90vh] rounded-tl-xl rounded-bl-xl p-6 sm:w-[25rem] w-full border-l-2 dark:border-l-white border-l-black dark:bg-theme-white-dark bg-theme-white shadow-xl sm:translate-x-[100%] translate-y-[100%]",
                        modalState ? "sm:animate-openModal animate-md-openModal": "sm:animate-closeModal animate-md-closeModal"
                    )}>
                        <ShowElement.when isTrue={popUpType === PopupType.NewProject}>
                            <NewProjectForm />
                        </ShowElement.when>
                        <ShowElement.when isTrue={popUpType === PopupType.AddTeam}>
                            <InviteTeammate />
                        </ShowElement.when>
                    </div>
                </section>
            </ShowElement.when>
        </popContext.Provider>
    );
}