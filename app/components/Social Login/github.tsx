import * as React from 'react';
import { useSession, signIn, } from "next-auth/react";
import Image from 'next/image';
import { ResponseWithError, ResponseWithoutError } from '@/lib/Types';
import { useRouter } from 'next/navigation';
import { performLogin } from '@/lib/session';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import Link from 'next/link';

export function LoginWithGitHub() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();
    const linkToDashboardRef = React.useRef<HTMLAnchorElement>(null)

    
    React.useEffect(() => {
        if (status != "authenticated") return;
        if (!session.user) return;
        if (!session.user.email) return;
        if (isLoading) return;


        handleLoginAction(session.user);
    }, [session, status]);

    const handleLoginAction = React.useCallback(async (loginProp: { name?: string | null, email?: string | null, image?: string | null }) => {
        if (isLoading) return;
        if (!loginProp.email) return;
        setIsLoading(true);

        const expirationDate = 1;
        const payload = {
            email: loginProp.email,
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
                const { status, message, type } = data;

                if (status === 400) {
                    const userName = loginProp.name;
                    const userImage = loginProp.image ?? "";

                    if (!userName) throw new Error("No username found.");
                    if (type === 5) {
                        const signUp_Promise = handleSignUpAction(payload.email, userName, userImage);
                        toast.promise(signUp_Promise, {
                            error: "Failed to create account!",
                            loading: "Setting up your new account",
                            success: "Account created with GitHub.",
                        });
                        
                        return;
                    }

                    throw new Error("Oops! Something went wrong.");
                } else {
                    performLogin(`${message.userId} ${message.auth}`, "Login successful", expirationDate);

                    setTimeout(() => {
                        if (!linkToDashboardRef.current) {
                            router.push("/dashboard");
                            return;
                        };

                        linkToDashboardRef.current.click();
                    }, 1000);
                }
            })
            .catch((error) => {
                toast.error("Oops! Something went wrong.");
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    const handleSignUpAction = React.useCallback(async(email: string, name: string, image: string)=>{
        const payload = {
            email,
            name,
            avatar: image,
            type: "social"
        };
        try {
            await fetch("/api/authentication/register", {
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
                .then((data: ResponseWithError | ResponseWithoutError<{ toast: string, token: string }>) => {
                    const { status, message } = data;

                    if (status === 400) {
                        throw new Error(message ?? "An error occurred");
                    } else {
                        performLogin(
                            `${message.token}`,
                            message.toast
                        );
                        setTimeout(() => {
                            if (!linkToDashboardRef.current) {
                                router.push("/dashboard");
                                return;
                            };

                            linkToDashboardRef.current.click();
                        }, 1000);
                    }
                });

        } catch (error) {
            setIsLoading(false);
            console.error(error);
            throw new Error(`${error}`);
        }
    }, []);

    const handleButtonClick = () =>{
        console.log("CLicked");
        if (status === "loading") return; 
        if (status === "authenticated") return; 
        signIn('github');
    }

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
            <Link href="/dashboard" ref={linkToDashboardRef} hidden></Link>
        </>
    );
}
