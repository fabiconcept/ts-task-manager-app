"use client"
import UploadThingy from "@/app/components/general/UploadThingy";
import { ErrorState } from "@/lib/Enums";
import { updateTaskerProfileInformation } from "@/lib/functions";
import { useDebounce } from "@/lib/Hooks/useDebouce";
import { fetchUserData } from "@/Redux Store/Thunk";
import { AppDispatch } from "@/Redux Store";
import { ErrorObj, TaskerProfile } from "@/lib/Interfaces";
import { fetchToken, generateFileName, validateText } from "@/lib/utilities";
import ShowElement from "@/lib/utilities/Show";
import { echoTaskerProfilesActiveId, echoTaskerProfilesResponse } from "@/Redux Store/Slices/profiles";
import clsx from "clsx";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState, useMemo, ChangeEvent, useContext } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FaFileLines, FaImage, FaPenToSquare, FaSignature } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { popContext } from "../PopUpDiv";
import { getSessionData } from "@/lib/session";

export default function EditProfile() {
    const cookieData = getSessionData("taskerUser")!;

    const dispatch = useDispatch<AppDispatch>();

    const { setCanClose, handleCloseModal } = useContext(popContext)!;

    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const withProfileRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const activeId = useSelector(echoTaskerProfilesActiveId);
    const { profiles } = useSelector(echoTaskerProfilesResponse);

    const [errorObj, setErrorObj] = useState<ErrorObj>({
        name: {
            status: ErrorState.IDLE,
            error: ""
        },
        avatar: {
            status: ErrorState.IDLE,
            error: ""
        },
        bio: {
            status: ErrorState.IDLE,
            error: ""
        },
    });

    const [companyName, setCompanyName] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [bioText, setBioText] = useState<string>("");
    const [wantProfileAvatar, setWantProfileAvatar] = useState<boolean>(false);

    const debouncedCompanyName = useDebounce(companyName, 500);
    const debouncedBioText = useDebounce(bioText, 500);

    useEffect(() => {
        setCanClose(!loading);
    }, [loading, setCanClose]);

    const companyProfile = useMemo((): TaskerProfile | undefined => {
        const activeProfile = profiles.find((profile) => profile.profile_id === activeId);

        if (!activeProfile) return;

        return activeProfile;
    }, [profiles, activeId]);

    useEffect(() => {
        if (!companyProfile) return;

        if (!debouncedCompanyName) {
            setErrorObj((prev)=>({...prev, name: {
                error: "Name field can't be empty!",
                status: ErrorState.BAD
            }}));
            return;
        }
        
        if (debouncedCompanyName.length > 50){
            setErrorObj((prev)=>({...prev, name: {
                error: "Name is too long!",
                status: ErrorState.BAD
            }}));
            return;
        }

        if (!validateText(debouncedCompanyName)){
            setErrorObj((prev)=>({...prev, name: {
                error: "Invalid character in Profile name!",
                status: ErrorState.BAD
            }}));
            return;
        }
        
        setErrorObj((prev)=>({...prev, name: {
            error: "",
            status: ErrorState.GOOD
        }}));
        return;
    }, [debouncedCompanyName, companyProfile]);
    
    useEffect(() => {
        if(debouncedBioText.length > 300){
            setErrorObj((prev)=>({...prev, bio: {
                error: "Bio is too long!",
                status: ErrorState.BAD
            }}));
            return;
        }
        setErrorObj((prev)=>({...prev, bio: {
            error: "",
            status: ErrorState.GOOD
        }}));
    }, [debouncedBioText]);

    useEffect(() => {
        if (!companyProfile) return;
        setCompanyName(companyProfile.name);
        setBioText(companyProfile.bio);
        setAvatarUrl(companyProfile.avatar);

        setWantProfileAvatar(companyProfile.avatar !== "");
    }, [companyProfile]);

    useEffect(() => {
        if (!withProfileRef.current || !companyProfile) return;
        withProfileRef.current.checked = companyProfile.avatar !== "";
    }, [companyProfile]);

    const isEdited = useMemo(()=>{
        if (!companyProfile) return false;
        if (!debouncedCompanyName) return false;

        if (profilePhotoFile && profilePhotoFile.name !== companyProfile.avatar) return true;
        if (!wantProfileAvatar && companyProfile.avatar !== "") return true;

        if (debouncedCompanyName !== companyProfile.name) return true;
        
        if (debouncedBioText !== companyProfile.bio) return true;

        return false;

    }, [debouncedBioText, debouncedCompanyName, profilePhotoFile, companyProfile, wantProfileAvatar]);

    const handleFileUpload = async (selectedFile: File) => {
        try {
            const bearerToken = await fetchToken();

            const fileName = generateFileName(selectedFile);
            const filenameDecoded = `/avatar/${fileName}`; 
            const filenameEncoded = encodeURIComponent(filenameDecoded);
      
            const sirvUrl = `https://api.sirv.com/v2/files/upload?filename=${filenameEncoded}`;

            const response = await fetch(sirvUrl, {
                method: 'POST',
                body: selectedFile,
                headers: {
                    "Authorization": `${bearerToken}`,
                    'Content-Type': `${selectedFile.type}`
                },
            });

            if (!response.ok) {
                throw new Error(`Error uploading image: ${await response.text()}`);
            }

            return `https://taskify.sirv.com${filenameDecoded}`;
            
          } catch (error) {
            console.error('Upload failed:', error);
            throw new Error(`${error}`);
          }
    }

    useEffect(() => {
        if (!profilePhotoFile) {
            setErrorObj((prev)=>({...prev, name: {
                error: "",
                status: ErrorState.IDLE
            }}));
            return;
        }

        setErrorObj((prev)=>({...prev, name: {
            error: "",
            status: ErrorState.GOOD
        }}));
    }, [profilePhotoFile]);

    useEffect(() => {
        if (!nameRef.current) return;
        nameRef.current.focus();
    }, [nameRef]);

    const canSubmit = useMemo(()=>{
        if (!isEdited) return false;

        if(!(errorObj.name.status === ErrorState.GOOD)) return false;
        if((errorObj.avatar.status === ErrorState.BAD)) return false;

        if(withProfileRef.current && withProfileRef.current.checked && !profilePhotoFile && !avatarUrl) {
            setErrorObj((prev)=>({...prev, bio: {
                error: "Please select an Image!",
                status: ErrorState.BAD
            }}));
            return false;
        };
        return true;
    }, [errorObj, isEdited, profilePhotoFile, avatarUrl]);

    const handleSubmit = async () => {
        if (wantProfileAvatar && !profilePhotoFile){
            setErrorObj((prev)=>({...prev, avatar: {
                error: "You said you want an avatar please upload one!",
                status: ErrorState.BAD
            }}));
            throw new Error("You said you want an avatar please upload one!");
        };
        setLoading(true);
        try {
            let newAvatarUrl
            if (profilePhotoFile) {
                newAvatarUrl = await handleFileUpload(profilePhotoFile);
            }else{
                if (wantProfileAvatar) {
                    newAvatarUrl = avatarUrl;
                }else{
                    newAvatarUrl = "";
                }
            }

            const payload: {profile_id: string, name: string, avatar: string, bio: string} = {
                profile_id: activeId,
                avatar: newAvatarUrl,
                bio: debouncedBioText,
                name: debouncedCompanyName
            }

            await updateTaskerProfileInformation(payload);

            setLoading(false);
            handleCloseModal();

            dispatch(fetchUserData(cookieData));

        } catch (error) {
            setLoading(false);
            console.error("Failed to update because: ", error);
            throw new Error(`${error}`);
        }

    }

    const watchSubmit = (e: FormEvent) => {
        if (!canSubmit) return;
        if (loading) return;
        e.preventDefault();
        const promise = handleSubmit();
        toast.promise(promise, {
            loading: "Updating profile information...",
            success: "Profile updated ✅🚀",
            error: "Failed to update profile information ❌"
        });
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
                            errorObj.name.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"

                        )}><FaSignature /></span>
                        <span>Profile name<span className={"text-red-600"}>{errorObj.name.status === ErrorState.BAD ? `: ${errorObj.name.error}` : ""}</span> </span>
                    </span>
                    <input
                        type="text"
                        placeholder="Pick something funny"
                        required
                        value={companyName}
                        onChange={(e: ChangeEvent<HTMLInputElement>)=>setCompanyName(e.target.value)}
                        ref={nameRef}
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-lg border dark:border-white focus:dark:border-theme-main")}
                    />
                </div>

                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                            errorObj.avatar.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"
                        )}><FaImage /></span>
                        <p className="flex justify-between w-full gap-4 items-center pr-2">
                            <span className="flex-1">Profile avatar<span className={"text-red-600"}>{errorObj.avatar.status === ErrorState.BAD ? `: ${errorObj.avatar.error}` : ""}</span> </span>

                            <label htmlFor="toggleB" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        id="toggleB" 
                                        ref={withProfileRef} 
                                        className="sr-only" 
                                        onChange={(e: ChangeEvent<HTMLInputElement>)=>setWantProfileAvatar(e.target.checked)}
                                    />
                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                </div>
                            </label>

                        </p>
                    </span>
                    <UploadThingy getUpload={setProfilePhotoFile} defaultPicture={avatarUrl} disabled={!wantProfileAvatar}  />
                </div>

                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                            errorObj.bio.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"
                        )}><FaFileLines /></span>
                        <span>Profile bio<span className={"text-red-600"}>{errorObj.bio.status === ErrorState.BAD ? `: ${errorObj.bio.error}` : ""}</span></span>
                    </span>

                    <textarea
                        name=""
                        id=""
                        cols={30}
                        placeholder="Enter a short bio of the project..."
                        rows={5}
                        value={bioText}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>)=>setBioText(e.target.value)}
                        ref={descriptionRef}
                        style={{ resize: "none" }}
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-lg border dark:border-white focus:dark:border-theme-main resize-none")}
                    ></textarea>
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
