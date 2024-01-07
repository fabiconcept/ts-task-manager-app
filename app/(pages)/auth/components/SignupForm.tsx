"use client"


import { testSwitch } from "@/lib/Enums";
import { useDebounce } from "@/lib/Hooks/useDebouce";
import { validateFullName, validateEmail, validatePassword } from "@/lib/utilities";
import { clsx } from "clsx";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

export default function SignupForm() {
    const errorInputClass = 'bg-red-300/10 border-red-500 focus:border-red-500';
    const generalInputClass= "p-4 flex-1 border outline-none rounded-lg relative";
    const idleClass = "bg-theme-white/25 dark:border-theme-white/25 border-theme-white-dark/25 focus:border-theme-main"

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


    const handleSubmit = (e:FormEvent) => {
        e.preventDefault();
        if(!canSubmit) return;
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
                <div className="flex flex-col gap-3 flex-1 min-w-full">
                    <p className="flex justify-between items-center">
                        <label htmlFor="passwordField">Password <span className="text-theme-main">*</span></label>
                        <span className="text-red-600">
                            {inputsValid.password.errorMessage}
                        </span>
                    </p>
                    <input
                        type="password"
                        placeholder="Password*"
                        name="passwordField"
                        value={passwordText}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordText(e.target.value)}
                        className={clsx(
                            generalInputClass,
                            inputsValid.password.status === testSwitch.FAILED ? errorInputClass: idleClass
                        )}
                    />
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
                    "p-4 rounded-lg border cursor-default border-theme-text w-full font-semibold opacity-60",
                    canSubmit && "shadow-black/5 bg-theme-text border-transparent select-none cursor-pointer shadow-lg opacity-100  active:scale-90"
                )}>
                    Sign Up
                </button>
            </section>
        </form>
    )
}