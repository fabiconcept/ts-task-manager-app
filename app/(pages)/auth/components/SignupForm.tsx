"use client"


import { AuthResponseType, testSwitch } from "@/lib/Enums";
import { useDebounce } from "@/lib/Hooks/useDebouce";
import { RequestBody, ResponseWithError, ResponseWithoutError } from "@/lib/Types";
import { performLogin } from "@/lib/session";
import { validateFullName, validateEmail, validatePassword } from "@/lib/utilities";
import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function SignupForm() {
    const errorInputClass = 'bg-red-300/10 border-red-500 focus:border-red-500';
    const generalInputClass= "p-4 flex-1 border outline-none rounded-lg relative";
    const idleClass = "bg-theme-white/25 dark:border-theme-white/25 border-theme-white-dark/25 focus:border-theme-main"

    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const [inputsValid, setInputsValid] = useState({
        name: {
            status: testSwitch.IDLE,
            errorMessage:"",
        },
        email: {
            status: testSwitch.IDLE,
            errorMessage:"",
        },
        password: {
            status: testSwitch.IDLE,
            errorMessage:"",
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [checkBoxState, setCheckBoxState] = useState<boolean>(false);

    const [nameText, setNameText] = useState("");
    const [emailText, setEmailText] = useState("");
    const [passwordText, setPasswordText] = useState("");

    const emailDebounce = useDebounce<string>(emailText, 500);
    const nameDebounce = useDebounce<string>(nameText, 500);
    const passwordDebounce = useDebounce<string>(passwordText, 500);

    const canSubmit = useMemo(()=>{
        return inputsValid.name.status === testSwitch.PASSED && inputsValid.email.status === testSwitch.PASSED && inputsValid.password.status === testSwitch.PASSED && checkBoxState;
    }, [inputsValid.name.status, inputsValid.email.status, inputsValid.password.status, checkBoxState]);

    useEffect(() => {
        if(emailDebounce === "") {
            setInputsValid((prev)=> ({...prev, email: {status:testSwitch.IDLE, errorMessage: ""}}));
            return;
        }

        const testResult = validateEmail(emailDebounce);
        
        if (!testResult) {
            setInputsValid((prev)=> ({...prev, email: {status:testSwitch.FAILED, errorMessage: "Invalid email address!"}}));
            return;
        }

        setInputsValid((prev) => ({ ...prev, email: { status: testSwitch.PASSED, errorMessage: "" } }));
    }, [emailDebounce]);

    useEffect(() => {
        if(nameDebounce === "") {
            setInputsValid((prev)=>({...prev, name: {status:testSwitch.IDLE, errorMessage: ""}}));
            return;
        }
        const [condition, errorMessage] = validateFullName(nameDebounce);

        if (!condition) {
            setInputsValid((prev)=> ({...prev, name: {status:testSwitch.FAILED, errorMessage: errorMessage}}));
            return;
        }

        setInputsValid((prev) => ({ ...prev, name: { status: testSwitch.PASSED, errorMessage: "" } }));

    }, [nameDebounce]);
    
    useEffect(() => {
        if(passwordDebounce === "") {
            setInputsValid((prev) => ({ ...prev, password: { status: testSwitch.IDLE, errorMessage: "" }}));
            return;
        }
        const [condition, errorMessage] = validatePassword(passwordDebounce);
        if (!condition) {
            setInputsValid((prev)=> ({...prev, password: {status:testSwitch.FAILED, errorMessage: errorMessage}}));
            return;
        }

        setInputsValid((prev) => ({ ...prev, password: { status: testSwitch.PASSED, errorMessage: "" } }));

    }, [passwordDebounce]);


    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        if(!canSubmit || isLoading) return;

        setIsLoading(true);

        const payload = {
            email: emailDebounce,
            name: nameDebounce,
            password: passwordDebounce
        } satisfies RequestBody;

        try {
            await fetch("/api/authentication/register", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then((res)=>{
                if (!res.ok) {
                    throw new Error("Something went wrong!");
                }
                return res.json();
            })
            .then((data: ResponseWithError | ResponseWithoutError<{toast: string, token: string}>)=>{
                let unknownError : string | null = null;
                const { status, message, type } = data;

                if (status === 400) {
                    switch (type) {
                        case AuthResponseType.EmailError:
                            setInputsValid((prev)=> ({...prev, email: {status:testSwitch.FAILED, errorMessage: message}}));
                            break;
                        case AuthResponseType.NameError:
                            setInputsValid((prev)=> ({...prev, name: {status:testSwitch.FAILED, errorMessage: message}}));
                            break;
                        case AuthResponseType.UnknownError:
                            setInputsValid((prev)=> ({...prev, password: {status:testSwitch.FAILED, errorMessage: message}}));
                            break;

                        default: 
                            unknownError = "An error occurred";
                            throw new Error(message); 
                    }

                    setIsLoading(false);

                    toast.error(unknownError ?? message);
                }else{
                    performLogin(
                        `${message.token}`,
                        message.toast
                    );
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 1000);
                }
            });

        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <section className="flex flex-wrap gap-8">
                <div className="flex flex-wrap w-full gap-5">
                    <div className="flex flex-col gap-3 flex-1 min-w-fit">
                        <p className="flex justify-between items-center">
                            <label htmlFor="nameField">Name <span className="text-theme-main">*</span></label>
                            <span className="text-red-600">
                                {inputsValid.name.errorMessage}
                            </span>
                        </p>
                        <input
                            type="text"
                            placeholder="John Doe"
                            name="nameField"
                            value={nameText}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNameText(e.target.value)}
                            className={clsx(generalInputClass, inputsValid.name.status === testSwitch.FAILED ? errorInputClass: idleClass)}
                        />
                    </div>
                    <div className="flex flex-col gap-3 flex-1 min-w-fit">
                        <p className="flex justify-between items-center">
                            <label htmlFor="emailField">Email <span className="text-theme-main">*</span></label>
                            <span className="text-red-600">{inputsValid.email.errorMessage}</span>
                        </p>
                        <input
                            type="email"
                            placeholder="johndoe@example.com"
                            name="emailField"
                            value={emailText}
                            onChange={(e:ChangeEvent<HTMLInputElement>)=>setEmailText(e.target.value)}
                            className={clsx(generalInputClass, inputsValid.email.status === testSwitch.FAILED ? errorInputClass: idleClass)}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-3 flex-1 min-w-full relative">
                    <p className="flex justify-between items-center">
                        <label htmlFor="passwordField">Password <span className="text-theme-main">*</span></label>
                        <span className="text-red-600">
                            {inputsValid.password.errorMessage}
                        </span>
                    </p>
                    <input
                        type={`${!showPassword ? "password": "text"}`}
                        placeholder="Password*"
                        name="passwordField"
                        value={passwordText}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordText(e.target.value)}
                        className={clsx(
                            generalInputClass,
                            inputsValid.password.status === testSwitch.FAILED ? errorInputClass: idleClass
                        )}
                    />
                    {passwordDebounce.length > 0 && <div className="absolute -translate-y-1/2 mt-4 top-1/2 right-4 p-2 grid place-items-center cursor-pointer hover:opacity-100 opacity-60 active:scale-90 active:opacity-40" onClick={()=>setShowPassword(!showPassword)}>
                        <span className="relative flex items-center justify-center text-xl">
                            <span className={clsx(
                                showPassword ? "absolute opacity-100" : "opacity-0"
                            )}><FaEye /></span>
                            <span className={clsx(
                                !showPassword ? "absolute opacity-100" : "opacity-0"
                            )}><FaEyeSlash /></span>
                        </span>
                    </div>}
                </div>
                <div className="flex gap-4 p-2 items-center w-full">
                    <label className="container cursor-pointer w-fit">
                        <input 
                            type="checkbox"  
                            className="hidden" 
                            onChange={(e:ChangeEvent<HTMLInputElement>)=>setCheckBoxState(e.target.checked)}
                        />
                        <svg viewBox="0 0 64 64" height="1.25em" className="overflow-visible" width="1.25em">
                            <path className="path fill-none dark:stroke-theme-white stroke-theme-white-dark" d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938"></path>
                        </svg>
                    </label>
                    <span>
                        <span className="opacity-60">I&apos;ve read and agree with </span>
                        <Link className="text-theme-text" href={"#"}> Terms of Service </Link>
                        <span className="opacity-60">and our</span>
                        <Link className="text-theme-text" href={"#"}> Privacy Policy</Link> .
                    </span>
                </div>
                
                <button type={`${canSubmit ? "submit": "button"}`} className={clsx(
                    "p-4 rounded-lg border border-theme-text w-full font-semibold grid place-items-center",
                    (canSubmit && !isLoading) ? "shadow-black/5 bg-theme-text border-transparent select-none cursor-pointer shadow-lg opacity-100  active:scale-90" : "cursor-default opacity-60",
                )}>
                    {!isLoading && <span>Sign Up</span>}
                    {isLoading && <span>
                        <Image
                            src={"https://taskify.sirv.com/three-dots.svg"}
                            alt="loading"
                            height={100}
                            width={100}
                            className="object-contain w-6 h-auto py-2 dark:invert-0 invert"
                        />
                    </span>}
                </button>
            </section>
        </form>
    )
}