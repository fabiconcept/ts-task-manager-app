import GroupChat from "./components/GroupChat"
import SideBar from "./components/SideBar"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`layout`}>
                <SideBar />
                {children}
                <GroupChat />
            </body>
        </html>
    )
}