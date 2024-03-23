import SessionPolice from "@/app/components/SessionPolice";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";
import PopUpDiv from "./pop-up/PopUpDiv";

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
                {/* <PopUpDiv /> */}
                {children}
            </div>
        </>
    )
}