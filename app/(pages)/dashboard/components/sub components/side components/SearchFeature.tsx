"use client"

import { useDebounce } from "@/lib/Hooks/useDebouce";
import { SearchProp } from "@/lib/Interfaces";
import { realEscapeString } from "@/lib/utilities";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function SearchFeature( { performFunction, placeholder }: SearchProp) {
    const [searchString, setSearchString] = useState("")
    const debouceSearchString = useDebounce(searchString, 1000);

    useEffect(() => {
        // if (String(debouceSearchString).length === 0) return;
        performFunction(realEscapeString(debouceSearchString));
    }, [debouceSearchString, performFunction]);


    const preventSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    const handleSearchTextUpdate = (e:ChangeEvent<HTMLInputElement>)=> setSearchString(e.target.value);

    return (
        <form method="post" onSubmit={preventSubmit} className="flex items-center gap-2 w-full">
            <input 
                type="search" 
                placeholder={`${placeholder}`} 
                value={searchString}
                onChange={handleSearchTextUpdate}
                className="flex-1 max-w-[30rem] p-2 px-4 rounded-md opacity-50 focus:opacity-100 placeholder-shown:border-transparent border dark:border-white/50 border-black/50 outline-none"
            />
        </form>
    )
}