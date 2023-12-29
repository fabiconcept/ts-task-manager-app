import ActiveMember from "./ActiveMember";

type MessageProp = {
    from: "me" | "other";
}

export default function MessageElement(props:MessageProp) {
    return (
        <>
        
            {props.from === "me" ?
                <div className="self-end flex flex-col items-end gap-1">
                <div className="flex flex-row-reverse gap-2 items-end w-fit">
                    <ActiveMember type="small" />
                    <div className="p-3 rounded-tl-lg rounded-tr-lg rounded-bl-lg dark:bg-gray-600 bg-gray-300 max-w-[15rem]">
                        Lorem ipsum dolor sit amet.
                    </div>
                </div>
                <span className="pr-9 text-xs opacity-50">8:00 am</span>
            </div>
            :
            <div className="flex flex-col items-start gap-1">
                <div className="flex flex-row gap-2 items-end w-fit">
                    <ActiveMember type="small" active={true} />
                    <div className="p-3 rounded-tl-lg rounded-tr-lg rounded-br-lg bg-theme-main text-theme-white-dark font-semibold max-w-[15rem]">
                        Lorem, ipsum dolor.
                    </div>
                </div>
                <span className="pl-9 text-xs opacity-50">8:00 am</span>
            </div>
            }
        </>
    )
}