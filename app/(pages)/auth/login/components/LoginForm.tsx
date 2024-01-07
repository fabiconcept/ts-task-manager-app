"use client"
import { clsx } from "clsx";
import Link from "next/link";
import { FormEvent } from "react";

export default function LoginForm() {
    const errorInputClass = 'bg-red-300/10 border-red-500 focus:border-red-500';
    const generalInputClass = "p-4 flex-1 border dark:border-theme-white/25 border-theme-white-dark/25 focus:border-theme-main outline-none rounded-lg bg-theme-white/25 relative";

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <section className="flex flex-wrap gap-8">

                <div className="flex flex-col gap-3 flex-1 min-w-fit">
                    <p className="flex justify-between items-center">
                        <label htmlFor="emailField">Email <span className="text-theme-main">*</span></label>
                        <span className="text-red-600"></span>
                    </p>
                    <input
                        type="email"
                        placeholder="johndoe@example.com"
                        name="emailField"
                        className={clsx(generalInputClass)}
                    />
                </div>
                <div className="flex flex-col gap-3 flex-1 min-w-full">
                    <p className="flex justify-between items-center">
                        <label htmlFor="passwordField">Password <span className="text-theme-main">*</span></label>
                        <span className="text-red-600">Only letters: a-z and numbers: 0-9</span>
                    </p>
                    <input
                        type="password"
                        placeholder="Password*"
                        name="passwordField"
                        className={clsx(
                            generalInputClass,
                            errorInputClass
                        )}
                    />
                </div>
                <div className="flex gap-4 p-2 items-center w-full">
                    <label className="container cursor-pointer w-fit">
                        <input type="checkbox" className="hidden" />
                        <svg viewBox="0 0 64 64" height="1.25em" className="overflow-visible" width="1.25em">
                            <path className="path fill-none dark:stroke-theme-white stroke-theme-white-dark" d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938"></path>
                        </svg>
                    </label>
                    <span>
                        Remember me. - <span className="opacity-50 pointer-events-none text-theme-text">(24hrs)</span>
                    </span>
                </div>

                <button type="submit" className="shadow-lg select-none shadow-black/5 p-4 rounded-lg active:scale-90 bg-theme-text w-full font-semibold">
                    Sign Up
                </button>
            </section>
        </form>
    )
}