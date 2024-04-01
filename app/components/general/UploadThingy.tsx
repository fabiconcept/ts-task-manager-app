"use client"
import Image from "next/image";
import ShowElement from "@/lib/utilities/Show";
import { ErrorState } from "@/lib/Enums";
import { ErrorObj } from "@/lib/Interfaces";
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { FaArrowUpFromBracket } from "react-icons/fa6";
import clsx from "clsx";

const UploadThingy = ({ defaultPicture, getUpload }: { defaultPicture?: string, getUpload: Dispatch<SetStateAction<File | null>> }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errorObj, setErrorObj] = useState<ErrorObj>({
        upload: {
            status: ErrorState.IDLE,
            error: ""
        }
    });
    const [previewUrl, setPreviewUrl] = useState<string>(defaultPicture ? defaultPicture : "");

    const handleFileChange = useCallback((e: FileList | null) => {
        if (!e) {
            setErrorObj((prev) => ({
                ...prev,
                upload: {
                    error: "Please select an image file!",
                    status: ErrorState.BAD
                }
            }))
            setPreviewUrl(defaultPicture ? defaultPicture : "");
            return;
        };

        const file = e[0];

        const allowedFilesTypes = [
            "image/jpg",
            "image/jpeg",
            "image/png",
            "image/gif",
        ]

        if (!allowedFilesTypes.includes(file.type)) {
            setErrorObj((prev) => ({
                ...prev,
                upload: {
                    error: "Only (PNG, JPG, JPEG, GIF) is allowed!",
                    status: ErrorState.BAD
                }
            }))
            setPreviewUrl(defaultPicture ? defaultPicture : "");
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setErrorObj((prev) => ({
                ...prev,
                upload: {
                    error: "It's too huge 😎!",
                    status: ErrorState.BAD
                }
            }));
            setPreviewUrl(defaultPicture ? defaultPicture : "");
            return;
        }

        setErrorObj((prev) => ({
            ...prev,
            upload: {
                error: "",
                status: ErrorState.GOOD
            }
        }));

        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        }

        reader.readAsDataURL(file);
        getUpload(file);
    }, [defaultPicture, getUpload]);

    useEffect(() => {
        const handleDragOver = (event: DragEvent) => {
            event.preventDefault();
        };

        const handleDrop = (event: DragEvent) => {
            event.preventDefault();
            if (!event || !event.dataTransfer) return;

            const files = event.dataTransfer.files;

            if (files.length > 0) {
                // Clear any existing value for reusability
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                    fileInputRef.current.files = files;
                }

                // Perform any necessary actions with the file
                handleFileChange(files)
            }
        };

        // Attach event listeners to the window
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        // Cleanup function to remove event listeners on unmount
        return () => {
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, [handleFileChange]);

    return (
        <>
            <div className={clsx(
                "bg-white/5 relative hover:bg-white/10 w-full h-[10rem] rounded-lg border dark:border-white/50 hover:dark:border-theme-main grid place-items-center",
                errorObj.upload.status === ErrorState.BAD ? "border-red/80" : "dark:border-white/50 hover:dark:border-theme-main"
            )}>
                <div className="absolute flex flex-col gap-2 items-center text-sm z-10">
                    <FaArrowUpFromBracket className="text-lg" />
                    <p>Drag & drop or <span className="text-theme-text font-semibold">choose a file</span> to upload</p>
                    <p className="text-xs opacity-60">.JPG, .PNG, .GIF</p>
                    <span className={"text-red-600"}>{errorObj.upload.status === ErrorState.BAD ? `: ${errorObj.upload.error}` : ""}</span>
                </div>
                <ShowElement.when isTrue={previewUrl !== ""}>
                    <div className="rounded-lg overflow-hidden h-full w-full top-0 left-0 grid place-items-center opacity-70">
                        <Image
                            src={previewUrl}
                            alt="preview image"
                            height={500}
                            width={500}
                            className="h-full w-full object-contain"
                        />
                    </div>
                </ShowElement.when>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}
                    className="absolute h-full w-full top-0 left-0 cursor-pointer opacity-0"
                />
                <div className="active:scale-95 absolute left-1/2 -translate-x-1/2 -bottom-4 px-3 py-2 rounded-lg bg-red-500 text-white cursor-pointer">reset</div>
            </div>
        </>
    )
}

export default UploadThingy;