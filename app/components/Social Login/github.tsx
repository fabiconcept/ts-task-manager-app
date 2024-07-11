import * as React from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image';
import { ResponseWithError, ResponseWithoutError } from '@/lib/Types';
import { useRouter } from 'next/navigation';
import { performLogin } from '@/lib/session';
import clsx from 'clsx';

export interface ILoginWithGitHubProps {
}

export function LoginWithGitHub(props: ILoginWithGitHubProps) {
    const { data, status } = useSession();
    const router = useRouter();


    const handleLoginAction = React.useCallback(async (email: string) => {
        const expirationDate = 1;
        const payload = {
            email: email,
            type: "social",
            exp: expirationDate * (60 * 60 * 1000),
        };

        await fetch("/api/authentication/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Something went wrong!");
                }
                return res.json();
            })
            .then((data: ResponseWithError | ResponseWithoutError) => {
                const { status, message } = data;

                if (status === 400) {

                } else {
                    // performLogin(`${message.userId} ${message.auth}`, "Login successful", expirationDate);

                    // setTimeout(() => {
                    //     router.push("/dashboard");
                    // }, 1000);

                    console.log(message);

                }
            })
            .catch((error) => {
                console.error(error);
            })
    }, []);

    const handleButtonClick = () =>{
        if (status === "loading") return; 
        signIn('github');
    }

    React.useEffect(() => {
        if (status != "authenticated") return;
        if (!data.user) return;
        if (!data.user.email) return;

        handleLoginAction(data.user.email);
    }, [data, status]);

    return (
        <>
            <button onClick={handleButtonClick} className={clsx(
                "p-4 flex-1 border dark:border-white/10 border-black/10 rounded-lg grid place-items-center select-none",
                status !== "loading" && "hover:bg-theme-text/10 active:scale-90 active:opacity-50 cursor-pointer"
            )}>
                {status !== "loading" && <Image
                    src={"https://taskify.sirv.com/github-ico.svg"}
                    alt="google logo"
                    height={512}
                    priority
                    width={512}
                    className="h-auto w-8 pointer-events-none dark:invert"
                />}
                {status==="loading" && <span>
                    <Image
                        src={"https://taskify.sirv.com/three-dots.svg"}
                        alt="loading"
                        height={100}
                        width={100}
                        className="object-contain w-8 h-auto py-2 dark:invert-0 invert"
                    />
                </span>}
            </button>
            <button onClick={()=>signOut()}>logout</button>
        </>
    );
}
