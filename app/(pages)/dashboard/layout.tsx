import SessionPolice from "@/app/components/SessionPolice";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <SessionPolice />
            <div className="flex flex-row">
                <NavBar />
                <SideBar />
                {children}
            </div>
        </>
    )
}