"use client"

import { AuthResponseType, testSwitch } from "@/lib/Enums";
import { useDebounce } from "@/lib/Hooks/useDebouce";
import { RequestBody, ResponseWithError, ResponseWithoutError } from "@/lib/Types";
import { performLogin } from "@/lib/session";
import { validateEmail } from "@/lib/utilities";
import { clsx } from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa6";


interface ReqBody extends Pick<RequestBody, "email" | "password"> {
    exp?: number,
}

export default function LoginForm() {
    const errorInputClass = 'bg-red-300/10 border-red-500 focus:border-red-500';
    const generalInputClass= "p-4 flex-1 border outline-none rounded-lg relative";
    const idleClass = "bg-theme-white/25 dark:border-theme-white/25 border-theme-white-dark/25 focus:border-theme-main";


    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const [inputsValid, setInputsValid] = useState({
        email: {
            status: testSwitch.IDLE,
            errorMessage:"",
        },
        password: {
            status: testSwitch.IDLE,
            errorMessage:"",
        }
    });
    const [emailText, setEmailText] = useState("");
    const [passwordText, setPasswordText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [checkBoxState, setCheckBoxState] = useState<boolean>(false);
    const emailDebounce = useDebounce<string>(emailText, 500);
    const passwordDebounce = useDebounce<string>(passwordText, 500);

    const canSubmit = useMemo(()=>{
        return inputsValid.email.status === testSwitch.PASSED && inputsValid.password.status === testSwitch.PASSED;
    }, [inputsValid.email.status, inputsValid.password.status]);

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
        if(passwordDebounce === "") {
            setInputsValid((prev)=> ({...prev, password: {status:testSwitch.IDLE, errorMessage: ""}}));
            return;
        }

        if (passwordDebounce.length < 5) {
            setInputsValid((prev) => ({ ...prev, password: { status: testSwitch.FAILED, errorMessage: "Password too short!" } }));
            return;
        }
        setInputsValid((prev) => ({ ...prev, password: { status: testSwitch.PASSED, errorMessage: "" } }));
    }, [passwordDebounce]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if(!canSubmit || isLoading) return;

        setIsLoading(true);

        const expirationDate = checkBoxState ? 24 : 1;

        const payload = {
            email: emailDebounce,
            password: passwordDebounce,
            exp: expirationDate * (60*60*1000),
        } satisfies ReqBody;

        await fetch("/api/authentication/login", {
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
        .then((data: ResponseWithError | ResponseWithoutError)=>{
            let unknownError : string | null = null;
            const { status, message, type } = data;

            if (status === 400) {
                switch (type) {
                    case AuthResponseType.EmailError:
                        setInputsValid((prev) => ({ ...prev, email: { status: testSwitch.FAILED, errorMessage: message } }));
                        break;
                    case AuthResponseType.PasswordError:
                        setInputsValid((prev) => ({ ...prev, password: { status: testSwitch.FAILED, errorMessage: message } }));
                        break;
                    case AuthResponseType.InvalidError:
                        setInputsValid((prev) => ({ ...prev, 
                            password: { status: testSwitch.FAILED, errorMessage: "Invalid credentials!" },
                        })); 
                        break;
                    default:
                        setInputsValid((prev) => ({ ...prev, 
                            password: { status: testSwitch.FAILED, errorMessage: "something went wrong." },
                            email: { status: testSwitch.FAILED, errorMessage: "something went wrong." },
                        }));

                        unknownError = "Oops! Something went wrong."
                        break;
                }

                setIsLoading(false);

                toast.error(unknownError ?? message);
            } else {
                performLogin(`${message.userId} ${message.auth}`, "Login successful", expirationDate);

                setTimeout(() => {
                    router.push("/dashboard");
                }, 1000);

            }
        })
        .catch((error)=>{
            setIsLoading(false);
            console.error(error);
        })


    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <section className="flex flex-wrap gap-8">

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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmailText(e.target.value)}
                        className={clsx(generalInputClass, inputsValid.email.status === testSwitch.FAILED ? errorInputClass : idleClass)}
                    />
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
                        <input type="checkbox" className="hidden" onChange={(e:ChangeEvent<HTMLInputElement>)=>setCheckBoxState(e.target.checked)} />
                        <svg viewBox="0 0 64 64" height="1.25em" className="overflow-visible" width="1.25em">
                            <path className="path fill-none dark:stroke-theme-white stroke-theme-white-dark" d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938"></path>
                        </svg>
                    </label>
                    <span>
                        Remember me. - <span className={clsx(
                            "opacity-50 pointer-events-none text-theme-text",
                            checkBoxState && "opacity-100"
                        )}>(24hrs)</span>
                    </span>
                </div>

                <button type={`${canSubmit ? "submit": "button"}`} className={clsx(
                    "p-4 rounded-lg border border-theme-text w-full font-semibold grid place-items-center",
                    (canSubmit && !isLoading) ? "shadow-black/5 bg-theme-text border-transparent select-none cursor-pointer shadow-lg opacity-100  active:scale-90": "cursor-default opacity-60"
                )}>
                    {!isLoading && <span>Login</span>}
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