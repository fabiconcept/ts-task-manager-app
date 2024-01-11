import SessionPolice from "@/app/components/SessionPolice";
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
            </div>
        </>
    )
}