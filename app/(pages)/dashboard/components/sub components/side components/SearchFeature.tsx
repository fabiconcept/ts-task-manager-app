"use client"

import { useDebounce } from "@/lib/Hooks/useDebouce";
import { SearchProp } from "@/lib/Interfaces";
import { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from "react";

export default function SearchFeature( { performFunction, placeholder }: SearchProp) {
    const [searchString, setSearchString] = useState("")
    const debouceSearchString = useDebounce(searchString, 1000);

    useEffect(() => {
        if (debouceSearchString === "") return;
        performFunction(debouceSearchString);
    }, [debouceSearchString, performFunction]);


    const preventSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    return (
        <form method="post" onSubmit={preventSubmit} className="flex items-center gap-2 w-full">
            <input 
                type="search" 
                placeholder={`${placeholder}`} 
                value={searchString}
                onChange={(e:ChangeEvent<HTMLInputElement>)=>setSearchString(e.target.value)}
                className="flex-1 max-w-[30rem] p-2 px-4 rounded-md opacity-50 focus:opacity-100 placeholder-shown:border-transparent border dark:border-white/50 border-black/50 outline-none"
            />
        </form>
    )
}