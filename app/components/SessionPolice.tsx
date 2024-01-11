"use client"

import { echoUserData } from "@/Redux Store/Slices/user data";
import { loadingState } from "@/lib/Enums";
import useAuthenticate from "@/lib/Hooks/useAuthenticate";
import clsx from "clsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";


const socket = io("http://localhost:2222", {
    path: "/api/webServer"
});

export default function SessionPolice() {
    const { error, loading } = useSelector(echoUserData);
    useAuthenticate();

    useEffect(() => {
        // if(!socket) return;
        // // Example: Listening for server events
        // socket.on("connect", () => {
        //     setTextText(socket.id);
        // });

        // return () => {
        //     socket.disconnect();
        // }

    });


    return(
        <>
            <section className={clsx(
                "fixed top-0 left-0 h-screen w-screen dark:bg-theme-white-dark/80 bg-theme-white/80 backdrop-blur-lg z-50 grid place-items-center",
                loading === loadingState.SUCCESS ? "opacity-0 pointer-events-none select-none cursor-none" : ""
            )}>
                <div className="flex flex-col items-center gap-3">
                    {!(loading === loadingState.FAILED) && <svg width="24" height="24" viewBox="0 0 24 24" className="md:scale-[2]" xmlns="http://www.w3.org/2000/svg">
                        <style>
                            {`
                            .spinner_zWVm { animation: spinner_5QiW 1.2s linear infinite, spinner_PnZo 1.2s linear infinite }
                            .spinner_gfyD { animation: spinner_5QiW 1.2s linear infinite, spinner_4j7o 1.2s linear infinite; animation-delay: .1s }
                            .spinner_T5JJ { animation: spinner_5QiW 1.2s linear infinite, spinner_fLK4 1.2s linear infinite; animation-delay: .1s }
                            .spinner_E3Wz { animation: spinner_5QiW 1.2s linear infinite, spinner_tDji 1.2s linear infinite; animation-delay: .2s }
                            .spinner_g2vs { animation: spinner_5QiW 1.2s linear infinite, spinner_CMiT 1.2s linear infinite; animation-delay: .2s }
                            .spinner_ctYB { animation: spinner_5QiW 1.2s linear infinite, spinner_cHKR 1.2s linear infinite; animation-delay: .2s }
                            .spinner_BDNj { animation: spinner_5QiW 1.2s linear infinite, spinner_Re6e 1.2s linear infinite; animation-delay: .3s }
                            .spinner_rCw3 { animation: spinner_5QiW 1.2s linear infinite, spinner_EJmJ 1.2s linear infinite; animation-delay: .3s }
                            .spinner_Rszm { animation: spinner_5QiW 1.2s linear infinite, spinner_YJOP 1.2s linear infinite; animation-delay: .4s }
                            
                            @keyframes spinner_5QiW {
                                0%, 50% { width: 7.33px; height: 7.33px }
                                25% { width: 1.33px; height: 1.33px }
                            }
                            
                            @keyframes spinner_PnZo {
                                0%, 50% { x: 1px; y: 1px }
                                25% { x: 4px; y: 4px }
                            }
                            
                            @keyframes spinner_4j7o {
                                0%, 50% { x: 8.33px; y: 1px }
                                25% { x: 11.33px; y: 4px }
                            }
                            
                            @keyframes spinner_fLK4 {
                                0%, 50% { x: 1px; y: 8.33px }
                                25% { x: 4px; y: 11.33px }
                            }
                            
                            @keyframes spinner_tDji {
                                0%, 50% { x: 15.66px; y: 1px }
                                25% { x: 18.66px; y: 4px }
                            }
                            
                            @keyframes spinner_CMiT {
                                0%, 50% { x: 8.33px; y: 8.33px }
                                25% { x: 11.33px; y: 11.33px }
                            }
                            
                            @keyframes spinner_cHKR {
                                0%, 50% { x: 1px; y: 15.66px }
                                25% { x: 4px; y: 18.66px }
                            }
                            
                            @keyframes spinner_Re6e {
                                0%, 50% { x: 15.66px; y: 8.33px }
                                25% { x: 18.66px; y: 11.33px }
                            }
                            
                            @keyframes spinner_EJmJ {
                                0%, 50% { x: 8.33px; y: 15.66px }
                                25% { x: 11.33px; y: 18.66px }
                            }
                            
                            @keyframes spinner_YJOP {
                                0%, 50% { x: 15.66px; y: 15.66px }
                                25% { x: 18.66px; y: 18.66px }
                            }
                        `}
                        </style>
                        <rect fill="#00db96" className="spinner_zWVm" x="1" y="1" width="7.33" height="7.33" />
                        <rect fill="#00db96" className="spinner_gfyD" x="8.33" y="1" width="7.33" height="7.33" />
                        <rect fill="#00db96" className="spinner_T5JJ" x="1" y="8.33" width="7.33" height="7.33" />
                        <rect fill="#00db96" className="spinner_E3Wz" x="15.66" y="1" width="7.33" height="7.33" />
                        <rect fill="#00db96" className="spinner_g2vs" x="8.33" y="8.33" width="7.33" height="7.33" />
                        <rect fill="#00db96" className="spinner_ctYB" x="1" y="15.66" width="7.33" height="7.33" />
                        <rect fill="#00db96" className="spinner_BDNj" x="15.66" y="8.33" width="7.33" height="7.33" />
                        <rect fill="#00db96" className="spinner_rCw3" x="8.33" y="15.66" width="7.33" height="7.33" />
                        <rect fill="#00db96" className="spinner_Rszm" x="15.66" y="15.66" width="7.33" height="7.33" />
                    </svg>}
                    <span>
                        {loading === loadingState.PENDING && "Loading..."}
                        {loading === loadingState.FAILED && error}
                    </span>
                </div>
            </section>
        </>
    )
}