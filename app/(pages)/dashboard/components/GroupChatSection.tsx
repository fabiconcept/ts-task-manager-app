import ActiveMembersSection from "./sub components/ActiveMembersSection";
import GroupChat from "./sub components/GroupChat";

export default function GroupChatSection() {
    return (
        <section className="h-screen px-2 py-4 border-l sm:w-[22rem] w-screen dark:bg-black/20 bg-white/50 dark:border-white/5 border-black/5 min-[1500px]:flex hidden flex-col">
            <div className="flex justify-between items-baseline mt-6 py-2 px-4 flex-shrink-0">
                <span className="font-semibold">
                    Members <span className="text-theme-text cursor-pointer">(<span className="underline">25</span>)</span>
                </span>
                <span className="opacity-50 text-sm cursor-pointer active:scale-90">View All</span>
            </div>
            {/* Active Members section */}
            <ActiveMembersSection />

            {/* Main chat section */}
            <span className="mt-6 font-semibold px-4">Group Chat</span>
            <GroupChat />
        </section>
    )
}