export default function SearchFeature() {
    return (
        <form method="post" onSubmit={()=>{}} className="flex items-center gap-2 w-full">
            <input 
                type="search" 
                placeholder="find project" 
                className="flex-1 p-2 rounded-md opacity-50 focus:opacity-100 placeholder-shown:border-transparent border dark:border-white/50 border-black/50 outline-none"
            />
        </form>
    )
}