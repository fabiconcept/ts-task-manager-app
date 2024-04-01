"use client"
import UploadThingy from "@/app/components/general/UploadThingy";
import ShowElement from "@/lib/utilities/Show";
import clsx from "clsx";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FaImage, FaPenToSquare, FaSignature } from "react-icons/fa6";

export default function EditProfile() {
    const nameRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)

    useEffect(() => {
        if (!nameRef.current) return;
        nameRef.current.focus();
    }, [nameRef]);

    const canSubmit = true;

    const watchSubmit = (e: FormEvent) => {
        e.preventDefault();
    }
    return (
        <form onSubmit={watchSubmit} className={clsx("flex flex-col gap-6 h-full")}>
            <div className="flex items-center gap-2 text-xl font-semibold pb-4 border-b dark:border-b-white/10 border-b-black/10">
                <span className="opacity-80 text-xl text-theme-main"><FaPenToSquare /></span>
                Edit Information
            </div>

            <div className={"flex flex-1 overflow-y-auto flex-col gap-6 pb-6"}>
                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                        )}><FaSignature /></span>
                        <span>Profile name<span className={"text-red-600"}></span> </span>
                    </span>
                    <input
                        type="text"
                        placeholder="Pick something funny"
                        required
                        ref={nameRef}
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-lg border dark:border-white focus:dark:border-theme-main")}
                    />
                </div>
                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                        )}><FaImage /></span>
                        <span>Profile avatar<span className={"text-red-600"}></span> </span>
                    </span>
                    <UploadThingy getUpload={setProfilePhotoFile} />
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
                        Update profile
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
    );
}
