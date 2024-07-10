import * as React from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image';

export interface ILoginWithGitHubProps {
}

export function LoginWithGitHub(props: ILoginWithGitHubProps) {
    const handleLoginAction = ()=>{}
    return (
        <button onClick={() => signIn('github')} className="p-4 flex-1 border dark:border-white/10 border-black/10 rounded-lg grid place-items-center hover:bg-theme-text/10 active:scale-90 active:opacity-50 cursor-pointer select-none">
            <Image
                src={"https://taskify.sirv.com/github-ico.svg"}
                alt="google logo"
                height={512}
                priority
                width={512}
                className="h-auto w-8 pointer-events-none dark:invert"
            />
        </button>
    );
}
