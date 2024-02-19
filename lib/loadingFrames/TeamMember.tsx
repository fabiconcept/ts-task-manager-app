export default function TeamMemberLoading() {

    return (
        <div className='rounded-md dark:bg-white/10 bg-dark/10 h-[10rem] border hover:dark:border-white/80 dark:border-white/50 hover:border-black/80 border-black/50 relative overflow-hidden'>
            
            <div className='relative z-10 p-2 flex flex-col'>
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-1 capitalize p-2'>
                        <div className="w-16 h-1 rounded-2xl animate-pulse bg-white/80"></div>
                    </div>
                    
                </div>
                <div className={'flex-1 px-4 py-6 flex flex-col items-center gap-3'}>
                    <div className='h-[4rem] w-[4rem] rounded-full overflow-hidden grid place-items-center border bg-white/80 animate-pulse'>
                    </div>
                    <div className='max-w-full text-sm flex gap-3 p-2'>
                        <div className="w-8 h-1 rounded-2xl animate-pulse bg-white/80"></div>
                        <div className="w-12 h-1 rounded-2xl animate-pulse bg-white/80"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}