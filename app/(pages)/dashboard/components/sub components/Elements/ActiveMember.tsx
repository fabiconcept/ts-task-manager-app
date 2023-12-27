type UserProp = {
    type: "mid" | "small";
    active?: boolean;
}

export default function ActiveMember(props: UserProp) {
    const afterStyle = props.type === "mid" ? "after:border-2 after:h-3 after:w-3 p-1" : "after:h-2 after:w-2";
    const activeStatus = props.active === undefined ? "" : (props.active ? `after:absolute after:bottom-0 ${afterStyle} after:z-10 after:right-0 after:rounded-full after:bg-green-500 border dark:border-white/20 border-black/20` : `after:absolute after:bottom-0 ${afterStyle} after:z-10 after:right-0 after:rounded-full after:bg-red-500 border dark:border-white/20 border-black/20 `)
    const styleClass = props.type === "mid" ? "h-12 w-12" : "h-7 w-7";
    return (
        <div className={`${styleClass} ${activeStatus} relative rounded-full`}>
            <div className="h-full w-full rounded-full overflow-hidden bg-black">

            </div>
        </div>
    )
}