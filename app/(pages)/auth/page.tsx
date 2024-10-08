import Link from "next/link";
import SignupForm from "./components/SignupForm";
import clsx from "clsx";
import Image from "next/image";
import { LoginWithGitHub } from "@/app/components/Social Login/github";

export default function AuthPage() {
    return (
        <main className="overflow-x-hidden relative w-screen h-screen grid place-items-center md:p-4">
            <section className="max-w-[100rem] md:max-h-[60rem] h-full w-full bg-theme-white dark:bg-theme-white-dark md:rounded-3xl grid lg:grid-cols-2">
                <div className="p-12 flex flex-col gap-6 overflow-y-auto">
                    <div>
                        <span>Have an account?</span> <Link className="text-theme-text font-semibold" href={"/auth/login"}>Sign in</Link>
                    </div>
                    <div className="w-full flex-1 flex flex-col justify-center">
                        <p className="text-5xl font-semibold my-8">Sign Up</p>
                        <SignupForm />
                    </div>

                    <div>
                        <div className={clsx("h-[1px] w-full dark:bg-white/10 bg-black/10 relative my-6")}>
                            <p className="text-sm px-3 bg-theme-white dark:bg-theme-white-dark w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Or Sign up with</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="p-4 flex-1 border dark:border-white/10 border-black/10 rounded-lg grid place-items-center hover:bg-theme-text/10 active:scale-90 active:opacity-50 cursor-pointer select-none">
                                <Image
                                    src={"https://taskify.sirv.com/google-ico.png"}
                                    alt="google logo"
                                    height={512}
                                    priority
                                    width={512}
                                    className="h-auto w-8 pointer-events-none"
                                />
                            </div>
                            <LoginWithGitHub />
                        </div>
                    </div>
                </div>
                <div className="lg:flex hidden flex-col select-none p-2">
                    <div className="flex-1 pointer-events-none rounded-2xl overflow-hidden relative">
                        <Image
                            src={"https://taskify.sirv.com/dddepth-222.jpg"}
                            alt="google logo"
                            priority
                            height={1024}
                            width={1024}
                            className="h-full w-auto object-cover pointer-events-none dark:invert"
                        />
                        <div className="absolute top-0 left-0 bg-black/50 h-full w-full text-white text-5xl p-12 grid place-items-center text-center">
                            <span>
                            Welcome to Task Manager! Let&apos;s get you started.
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}