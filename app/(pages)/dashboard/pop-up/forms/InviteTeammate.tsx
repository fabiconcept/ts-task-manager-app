"use client"
import clsx from "clsx";
// import { GiHighFive } from "react-icons/gi";
import { FaAt, FaUserPlus } from "react-icons/fa6";
import { useContext, useRef, useEffect, useState, FormEvent, ChangeEvent, useCallback } from "react";
import { popContext } from "../PopUpDiv";
import ShowElement from "@/lib/utilities/Show";
import Image from "next/image";
import toast from "react-hot-toast";
import { echoTaskerProfilesActiveId } from "@/Redux Store/Slices/profiles";
import { useSelector } from "react-redux";
import { useDebounce } from "@/lib/Hooks/useDebouce";
import { ErrorState } from "@/lib/Enums";
import { validateEmail } from "@/lib/utilities";
import { inviteTeamMember } from "@/lib/functions";
import { echoTeamFromActiveProfile } from "@/Redux Store/Slices/profiles/team";

interface ErrorStateObj {
    status: ErrorState;
    error: string;
}
interface ErrorObj {
    [key: string]: ErrorStateObj; // Index signature
}
export default function InviteTeammate() {
    const { setCanClose, handleCloseModal } = useContext(popContext)!;
    const emailRef = useRef<HTMLInputElement>(null);
    const activeId = useSelector(echoTaskerProfilesActiveId);
    const teamList = useSelector(echoTeamFromActiveProfile);

    const [loading, setLoading] = useState<boolean>(false);
    const [emailText, setEmailText] = useState("");
    const [errorObj, setErrorObj] =  useState<ErrorObj>({
        email: {
            status: ErrorState.IDLE,
            error: ""
        }
    });
    const debouncedEmail = useDebounce(emailText, 500);

    useEffect(()=>{
        if (!emailRef.current) return;
        emailRef.current.focus();
    },[emailRef]);

    useEffect(() => {
        if(!debouncedEmail) {
            setErrorObj((prev)=>({...prev, email: {status: ErrorState.IDLE, error: "" }}));
            return;
        }

        if (teamList && teamList.length > 0 && teamList.find((teamMember)=> teamMember.email === debouncedEmail)) {
            if (teamList.find((teamMember)=> teamMember.email === debouncedEmail)?.type === "owner") {
                setErrorObj((prev)=>({...prev, email: {status: ErrorState.BAD, error: "Can't invite owner 😂!" }}));
            }else{
                setErrorObj((prev)=>({...prev, email: {status: ErrorState.BAD, error: "Can't invite team mamber again 😅!" }}));
            }
            return;
        }

        const testResult = validateEmail(debouncedEmail);

        if (!testResult) {
            setErrorObj((prev)=>({...prev, email: {status: ErrorState.BAD, error: "Invalid email address" }}));
            return;
        }

        setErrorObj((prev)=>({...prev, email: {status: ErrorState.GOOD, error: "" }}));
    }, [debouncedEmail, teamList]);

    useEffect(() => {
        setCanClose(!loading);
    }, [loading, setCanClose]);

    const canSubmit = errorObj.email.status === ErrorState.GOOD;

    const handleSubmit = async(e:FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const inviteData: { email: string, profile_id: string } = {
            email: debouncedEmail,
            profile_id: activeId
        }

        try{
            await inviteTeamMember(inviteData);

            setLoading(false);
            handleCloseModal();
        }catch(error){
            setLoading(false);
            setErrorObj((prev)=>({...prev, email: {status: ErrorState.BAD, error: `${error}` }}));
            throw new Error(`${error}`);            
        }

    }

    const watchSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (loading || !canSubmit) return;

        const promise = handleSubmit(e);
        toast.promise(promise, {
            loading: "Sending invitation...",
            error: "Failed to send invitation. ❌",
            success: "Invitation sent ✅."
        })
    }

    return (
        <form onSubmit={watchSubmit} className={clsx("flex flex-col gap-6 h-full")}>
            <div className="flex items-center gap-2 text-xl font-semibold pb-4 border-b dark:border-b-white/10 border-b-black/10">
                <span className="opacity-80 text-xl text-theme-main"><FaUserPlus /></span>
                Invite Teammate
            </div>

            <div className={"flex flex-1 overflow-y-auto flex-col gap-6 pb-6"}>
                <span className={"opacity-50"}>Invite your team to review and collaborate on projects.</span>

                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                            errorObj.email.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"
                        )}><FaAt /></span>
                        <span>Email address<span className={"text-red-600"}>{errorObj.email.status === ErrorState.BAD ? `: ${errorObj.email.error}` : ""}</span> </span>
                    </span>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        required
                        ref={emailRef}
                        value={emailText}
                        onChange={(e: ChangeEvent<HTMLInputElement>)=> setEmailText(e.target.value)}
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-md border dark:border-white focus:dark:border-theme-main")}
                    />
                </div>
            </div>

            <button
                type="submit"
                className={clsx(
                    "outline-none w-full py-2 px-3 rounded-lg",
                    canSubmit ? "" : "opacity-50 grayscale",
                    loading ? "cursor-wait border border-theme-main grid place-items-center" : "hover:bg-theme-main focus:bg-theme-main hover:border-transparent border border-theme-main text-theme-main hover:text-theme-white-dark focus:text-theme-white-dark active:scale-90"
                )}
            >
                <ShowElement.when isTrue={!loading}>
                    <span>
                        Send Invite
                    </span>
                </ShowElement.when>
                <ShowElement.when isTrue={loading}>
                    <span>
                        <Image
                            src={"https://taskify.sirv.com/three-dots.svg"}
                            alt="loading"
                            height={80}
                            width={80}
                            className="object-contain w-6 h-auto py-2 dark:invert-0 invert"
                        />
                    </span>
                </ShowElement.when>
            </button>
        </form>
    )
}
