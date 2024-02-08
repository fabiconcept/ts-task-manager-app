import { SearchProp } from "@/lib/Interfaces";

export default function SearchFeature( { performFunction, placeholder }: SearchProp) {
    return (
        <form method="post" onSubmit={()=>{}} className="flex items-center gap-2 w-full">
            <input 
                type="search" 
                placeholder={`${placeholder}`} 
                className="flex-1 max-w-[30rem] p-2 px-4 rounded-md opacity-50 focus:opacity-100 placeholder-shown:border-transparent border dark:border-white/50 border-black/50 outline-none"
            />
        </form>
    )
}