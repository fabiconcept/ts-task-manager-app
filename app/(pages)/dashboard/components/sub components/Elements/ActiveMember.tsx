import Image from "next/image";
import { useMemo } from "react";

type UserProp = {
    type: "mid" | "small";
    active?: boolean;
}

const imagesList = [
    "https://taskify.sirv.com/65d1e1ed-d574-4945-b41d-14223ddf535c.jpg",
    "https://taskify.sirv.com/ba7f7181-b4b5-4aa9-8ab3-d1afe859ab50.jpg",
    "https://taskify.sirv.com/c863653a-143b-4ea4-a68c-94d9a9b15290.jpg",
    "https://taskify.sirv.com/d17ae546-4088-4a22-92b1-00c68d8c224d.jpg",
    "https://taskify.sirv.com/cac029af-9f80-4e21-94fb-5770339b32eb.jpg",
    "https://taskify.sirv.com/cac029af-9f80-4e21-94fb-5770339b32eb.jpg"
]

export default function ActiveMember(props: UserProp) {
    const randomId = useMemo(()=>Math.round(Math.random() * 5), []);
    const afterStyle = props.type === "mid" ? "after:border-2 after:h-3 after:w-3 p-1" : "after:h-2 after:w-2";
    const activeStatus = props.active === undefined ? "" : (props.active ? `after:absolute after:bottom-0 ${afterStyle} after:z-10 after:right-0 after:rounded-full after:bg-green-500 border dark:border-white/20 border-black/20` : `after:absolute after:bottom-0 ${afterStyle} after:z-10 after:right-0 after:rounded-full after:bg-red-500 border dark:border-white/20 border-black/20 `)
    const styleClass = props.type === "mid" ? "h-12 w-12" : "h-7 w-7";
    return (
        <div className={`${styleClass} ${activeStatus} relative rounded-full`}>
            <div className="h-full w-full rounded-full overflow-hidden bg-black grid place-items-center">
                <Image
                    src={imagesList[randomId]}
                    alt="photo"
                    height={200}
                    width={200}
                    className="h-full w-auto object-contain"
                />
            </div>
        </div>
    )
}