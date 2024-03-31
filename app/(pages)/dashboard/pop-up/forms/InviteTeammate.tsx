"use client"
import clsx from "clsx";
// import { GiHighFive } from "react-icons/gi";
import { FaAt, FaUserPlus } from "react-icons/fa6";
import { useContext, useRef, useEffect, useState, FormEvent } from "react";
import { popContext } from "../PopUpDiv";
import ShowElement from "@/lib/utilities/Show";
import Image from "next/image";
import { BrevoEmailClient } from "@/lib/Classes";

export default function InviteTeammate() {
    const { setCanClose, handleCloseModal } = useContext(popContext)!;
    const emailRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
        if (!emailRef.current) return;
        emailRef.current.focus();
    },[emailRef]);

    const testbrevo = async(e:FormEvent) => {
        e.preventDefault();
        const brevoClient = new BrevoEmailClient();

        brevoClient.sendEmail(
            'fabiconcept',
            'favourajokubi@gmail.com',
            'John Doe',
            'fabianajokubi@gmail.com',
            'Hello world',
            '<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>'
        )
            .then(response => {
                if (response.ok) {
                    console.log('Email sent successfully!');
                } else {
                    console.error('Error sending email:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error sending email:', error);
            });

    }

    return (
        <form onSubmit={testbrevo} className={clsx("flex flex-col gap-6 h-full")}>
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
                        )}><FaAt /></span>
                        <span>Email address</span>
                    </span>
                    <input
                        type="text"
                        placeholder="@jeffrey"
                        required
                        ref={emailRef}
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-md border dark:border-white focus:dark:border-theme-main")}
                    />
                </div>
            </div>

            <button
                type="submit"
                className={clsx(
                    "outline-none w-full py-2 px-3 rounded-lg",
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
