import SessionPolice from "@/app/components/SessionPolice";
import GroupChat from "./components/GroupChatSection";
import SideBar from "./components/SideBar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <SessionPolice />
            <div className="flex flex-row">
                <SideBar />
                {children}
                <GroupChat />
            </div>
        </>
    )
}