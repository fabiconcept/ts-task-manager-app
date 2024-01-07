import GroupChat from "./components/GroupChatSection";
import SideBar from "./components/SideBar";

import { Quicksand } from 'next/font/google';
const quicksand = Quicksand({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-row">
            <SideBar />
            {children}
            <GroupChat />
        </div>
    )
}