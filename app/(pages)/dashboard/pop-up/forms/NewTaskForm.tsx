import { useDebounce } from '@/lib/Hooks/useDebouce';
import ShowElement from '@/lib/utilities/Show';
import clsx from 'clsx';
import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaFolderPlus, FaHeading, FaFileLines, FaUserPlus, FaX } from 'react-icons/fa6';

export default function NewTaskForm() {

    const watchSubmit = () => {

    }

    return (
        <form onSubmit={watchSubmit} className={clsx("flex flex-col gap-6 h-full")}>
            <div className="flex items-center gap-2 text-xl font-semibold pb-4 border-b dark:border-b-white/10 border-b-black/10"> <span className="opacity-50 text-theme-main"><FaFolderPlus /></span> New task</div>
            <div className={"flex flex-1 overflow-y-auto flex-col gap-6 pb-6"}>
                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                        )}><FaHeading /></span>
                        <span>Task title</span>
                    </span>
                    <input
                        type="text"
                        placeholder="Pick something funny"
                        required
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-lg border dark:border-white focus:dark:border-theme-main")}
                    />
                </div>

                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                        )}><FaFileLines /></span>
                        <span>Task description</span>
                    </span>

                    <textarea
                        name=""
                        id=""
                        cols={30}
                        placeholder="Enter a short description of the task..."
                        rows={5}
                        style={{ resize: "none" }}
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-lg border dark:border-white focus:dark:border-theme-main resize-none")}
                    ></textarea>
                </div>

                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                        )}><FaUserPlus /></span>
                        <span>Task assignees <span className="opacity-50">(max of 3)</span></span>
                    </span>

                    <TaskAssigneeComponent />
                </div>
            </div>
        </form >
    )
}

type Assignee = {
    id: string,
    avatar: string,
    userName: string
}

type AssigneeOption = Assignee & {
    selected: boolean
}

const TaskAssigneeComponent = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [addedAssignees, setAddedAssignees] = useState<Assignee[]>([]);
    const [assigneesOptions, setAssigneesOptions] = useState<AssigneeOption[]>([]);
    const [assigneesOptionsDisplay, setAssigneesOptionsDisplay] = useState<AssigneeOption[]>([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 500)
    
    
    const showPlatform = debouncedSearchQuery.length > 0;
    const reachedLimit = addedAssignees.length === 3;

    useEffect(() => {
        const randomAssignees: Assignee[] = [
            {
                id: "1",
                avatar: "https://taskify.sirv.com/github-ico.svg",
                userName: "GitHub"
            },
            {
                id: "2",
                avatar: "https://taskify.sirv.com/svg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NDgiIGhlaWdodD0iNjQ4IiB2aWV3Qm94PSIwIDAgNjQ4IDY0OCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ.svg",
                userName: "User456"
            },
            {
                id: "3",
                avatar: "https://taskify.sirv.com/e5ac7718-1c7f-4fd3-acae-ca0a6e5265c5.jpg",
                userName: "Halle"
            },
            {
                id: "4",
                avatar: "https://taskify.sirv.com/google-ico.png",
                userName: "Google"
            },
            {
                id: "5",
                avatar: "https://taskify.sirv.com/859897c8-7c22-49ef-842f-c0a3954f9947.jpg",
                userName: "Joker DC"
            }
        ];

        const newList: AssigneeOption[] = [];
        randomAssignees.forEach((assignee)=>{
            newList.push({...assignee, selected: false});
        });

        setAssigneesOptions(newList);
    }, []);

    
    const clearSearchQuery = () => {
        setSearchQuery("");
    }

    const addAssigneeFunc = (id: string) => {
        if (reachedLimit) return;
        // Find the selected assignee option
        const selectedAssigneeOption = assigneesOptions.find(assignee => assignee.id === id);

        if (selectedAssigneeOption) {
            // Update the assigneesOptions state to mark the selected assignee as selected
            const updatedAssigneesOptions = assigneesOptions.map(assignee => {
                if (assignee.id === id) {
                    return { ...assignee, selected: true };
                }
                return assignee;
            });

            if(addedAssignees.length === 2) clearSearchQuery();
            // Update the addedAssignees state to add the selected assignee
            setAddedAssignees(prevAssignees => [...prevAssignees, selectedAssigneeOption]);

            // Update the assigneesOptions state
            setAssigneesOptions(updatedAssigneesOptions);

        }
    }

    const removeAssigneeFunc = (id: string) => {
        // Remove the assignee from addedAssignees state
        setAddedAssignees(prevAssignees => prevAssignees.filter(assignee => assignee.id !== id));
    
        // Update the assigneesOptions state to mark the assignee as not selected
        setAssigneesOptions(prevOptions => prevOptions.map(option => {
            if (option.id === id) {
                return { ...option, selected: false };
            }
            return option;
        }));
    }    


    useEffect(() => {
        if (debouncedSearchQuery === "") return;

        const searchResult = assigneesOptions.filter(option => option.userName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
        setAssigneesOptionsDisplay(searchResult);
    }, [debouncedSearchQuery, assigneesOptions]);
    


    return (
        <div className='relative w-full group'>
            <div className="p-3 rounded-xl flex items-center flex-wrap gap-2 border border-white/25 group-focus-within:border-theme-main hover:border-white">
                {addedAssignees.map((assignee)=>(
                    <SelectedTaskAssignee 
                        key={assignee.id} 
                        id={assignee.id} 
                        removeFunc={removeAssigneeFunc}
                        avatar={assignee.avatar} 
                        userName={assignee.userName} 
                    />
                ))}

                <ShowElement.when isTrue={!reachedLimit}>
                    <input
                        type="search"
                        className={"border-none outline-none bg-transparent flex-1 py-1 px-2"}
                        placeholder='Add team'
                        value={searchQuery}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </ShowElement.when>
            </div>

            <ShowElement.when isTrue={showPlatform}>
                <div className={clsx("absolute left-0 mt-3 w-full p-3 rounded-xl flex flex-col gap-3 border border-white/25")}>
                    <div className="flex justify-between items-center pb-2 border-b border-b-white/10">
                        <span>Members</span>
                        <span onClick={clearSearchQuery} className={"text-sm hover:text-red-600 cursor-pointer"}>
                            <FaX />
                        </span>
                    </div>
                    <ShowElement.when isTrue={assigneesOptionsDisplay.length > 0}>
                        <div className="grid overflow-y-auto max-h-[30rem]">
                            {assigneesOptionsDisplay.map((assignee) => (
                                <OptionTaskAssignee
                                    key={assignee.id}
                                    id={assignee.id}
                                    userName={assignee.userName}
                                    avatar={assignee.avatar}
                                    selected={assignee.selected}
                                    addFunc={addAssigneeFunc}
                                    removeFunc={removeAssigneeFunc}
                                />
                            ))}
                        </div>
                    </ShowElement.when>
                    <ShowElement.when isTrue={assigneesOptionsDisplay.length === 0}>
                        <p className="p-1 text-sm text-center opacity-60">
                        &#95;&#95;&#95; No data &#95;&#95;&#95;
                        </p>
                    </ShowElement.when>
                </div>
            </ShowElement.when>
        </div>
    )
}

const SelectedTaskAssignee = ({ avatar, userName, id, removeFunc }: { avatar: string, userName: string, id: string, removeFunc: (id: string) => void }) => { 
    return (
        <div className="p-1 rounded-3xl flex-1 flex items-center gap-2 border cursor-pointer hover:bg-white/10">
            <div className={clsx(
                "h-6 w-6 rounded-full font-bold border grid place-items-center overflow-hidden text-sm",
                avatar ? "bg-white" : "bg-theme-main text-black")}
            >
                {avatar ? 
                    <Image
                        src={avatar}
                        alt={userName}
                        height={50}
                        width={50}
                        className={"w-full h-full object-cover"}
                    /> 
                    : 
                    userName.split("")[0]
                }
            </div>
            <div className={"flex-1 truncate"}>
                {userName.split(" ")[0]}
            </div>
            <span onClick={()=>removeFunc(id)} className="pr-1 text-sm hover:text-red-600 cursor-pointer">
                <FaX />
            </span>
        </div>
    );
}

const OptionTaskAssignee = ({ id, avatar, userName, selected, addFunc, removeFunc }: { id: string, avatar: string, userName: string, selected: boolean, addFunc: (id: string) => void, removeFunc: (id: string) => void}) => { 
    const checkRef = useRef<HTMLInputElement>(null);

    const handleChange = () => {
        if (!checkRef.current) return;
        if (checkRef.current.checked) {
            addFunc(id);
            return
        }
        removeFunc(id);
    };

    return (
        <div className={"flex items-center gap-3 py-3 hover:bg-black/10 border-b border-b-white/5 last:border-b-transparent cursor-pointer"}>
            <div className="content scale-75">
                <label className="checkBox">
                    <input 
                        id="ch1" 
                        type="checkbox" 
                        ref={checkRef} 
                        checked={selected}
                        onChange={handleChange}
                    />
                    <div className="transition"></div>
                </label>
            </div>

            <div className={"flex items-center gap-2 flex-1"} onClick={() => checkRef.current && checkRef.current.click()}>
                <div className={clsx(
                    "h-7 w-7 rounded-full font-bold border grid place-items-center overflow-hidden text-sm",
                    avatar ? "bg-white" : "bg-theme-main text-black")}
                >
                    {avatar ?
                        <Image
                            src={avatar}
                            alt={userName}
                            height={50}
                            width={50}
                            className={"w-full h-full object-cover"}
                        />
                        :
                        userName.split("")[0]
                    }
                </div>

                <div className='flex-1 w-full truncate'>{userName}</div>
            </div>
        </div>
    );
}