import { ErrorState, Priority } from '@/lib/Enums';
import { useDebounce } from '@/lib/Hooks/useDebouce';
import ShowElement from '@/lib/utilities/Show';
import clsx from 'clsx';
import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState, useContext, useMemo, FormEvent } from 'react';
import { FaFolderPlus, FaHeading, FaFileLines, FaUserPlus, FaX, FaTriangleExclamation } from 'react-icons/fa6';
import { echoTaskerProfilesActiveId, echoTaskerProfilesResponse } from "@/Redux Store/Slices/profiles";
import { AppDispatch } from "@/Redux Store";
import { useDispatch, useSelector } from "react-redux";
import { popContext } from "../PopUpDiv";
import { ErrorObj } from '@/lib/Interfaces';
import { echoDisplayList, updateTaskerTeam } from '@/Redux Store/Slices/profiles/team';

type Assignee = {
    id: string,
    avatar: string,
    userName: string
}

export default function NewTaskForm() {
    const { setCanClose, handleCloseModal } = useContext(popContext)!;
    const dispatch = useDispatch<AppDispatch>();
    const activeId = useSelector(echoTaskerProfilesActiveId);
    const { profiles } = useSelector(echoTaskerProfilesResponse);

    useEffect(() => {
        if  (!activeId) return;
        if  (!profiles) return;

        const activeProfile = profiles.find((profile) => profile.profile_id === activeId);

        if (!activeProfile) return;

        dispatch(updateTaskerTeam({
            arr: activeProfile.team,
            id: activeProfile.owner
        }));
    }, [profiles, activeId, dispatch]);

    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const resetRef = useRef<HTMLButtonElement>(null);

    useEffect(()=>{
        if (!titleRef.current) return;
        titleRef.current.focus();
    },[titleRef]);

    const [errorObj, setErrorObj] =  useState<ErrorObj>({
        title: { status: ErrorState.IDLE, error: "" },
        description: { status: ErrorState.IDLE, error: "" },
        priorityLevel: { status: ErrorState.IDLE, error: "" },
        assignees: { status: ErrorState.IDLE, error: "" },
    });
    
    const [taskAssignees, setTaskAssignees] = useState<string[]>([]);

    const [titleText, setTitleText] = useState<string>("");
    const [descriptionText, setDescriptionText] = useState<string>("");
    const [priorityLevel, setPriorityLevel] = useState<Priority>(Priority.NONE);
    
    const titleDebounce = useDebounce(titleText, 500);
    const descriptionDebounce = useDebounce(descriptionText, 500);

    useEffect(() => {
        if(!titleDebounce) {
            setErrorObj((error)=>({...error, title: {status: ErrorState.IDLE, error: ""}}));
            return;
        };
        
        if(titleDebounce.length > 40) {
            setErrorObj((error)=>({...error, title: {status: ErrorState.BAD, error: "Title is too long"}}));
            return;
        };

        setErrorObj((error)=>({...error, title: {status: ErrorState.GOOD, error: ""}}));
        
    }, [titleDebounce]);

    useEffect(() => {
        if(!descriptionDebounce) {
            setErrorObj((error)=>({...error, description: {status: ErrorState.IDLE, error: ""}}));
            return;
        };

        if(descriptionDebounce.length > 300) {
            setErrorObj((error)=>(
                {...error, 
                    description: {
                        status: ErrorState.BAD, 
                        error: "Description is too long"
                    }
                }
            ));
            return;
        };

        setErrorObj((error)=>({...error, description: {status: ErrorState.GOOD, error: ""}}));
    }, [descriptionDebounce]);
    
    useEffect(() => {
        if(taskAssignees.length === 0) {
            setErrorObj((error)=>({...error, assignees: {status: ErrorState.IDLE, error: ""}}));
            return;
        };

        if(taskAssignees.length > 10) {
            setErrorObj((error)=>(
                {...error, 
                    assignees: {
                        status: ErrorState.BAD, 
                        error: "HTF!"
                    }
                }
            ));
            return;
        };

        setErrorObj((error)=>({...error, assignees: {status: ErrorState.GOOD, error: ""}}));
    }, [taskAssignees]);
    

    const [loading, setLoading]= useState(false);

    useEffect(() => {
        setCanClose(!loading);
    }, [loading, setCanClose]);

    const canSubmit = useMemo(()=>{
        if (errorObj.title.status !== ErrorState.GOOD) return false;
        if (errorObj.description.status !== ErrorState.GOOD) return false;
        if (errorObj.assignees.status !== ErrorState.GOOD) return false;
        if (loading) return false;

        return true;
    }, [errorObj, loading]);

    const priorityArray: Priority[] = [Priority.NONE, Priority.LOW, Priority.MEDIUM, Priority.HIGH];

    const watchSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        if (!resetRef.current) return;
        if (loading) return;

        const payload = {
            title: titleDebounce,
            description: descriptionDebounce,
            assignees: taskAssignees,
            priorityLevel
        }

        console.log(payload);

        resetRef.current.click();
        setLoading(true);
    }

    return (
        <form onSubmit={watchSubmit} className={clsx("flex flex-col gap-6 h-full")}>
            <div className="flex items-center gap-2 text-xl font-semibold pb-4 border-b dark:border-b-white/10 border-b-black/10"> <span className="opacity-50 text-theme-main"><FaFolderPlus /></span> New task</div>
            <div className={"flex flex-1 overflow-y-auto flex-col gap-6 pb-6"}>
                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                            errorObj.title.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"
                        )}><FaHeading /></span>
                        <span>Task title <span className={"text-red-600"}>{errorObj.title.status === ErrorState.BAD ? `: ${errorObj.title.error}` : ""}</span></span>
                    </span>
                    <input
                        type="text"
                        placeholder="Pick something funny"
                        required
                        onChange={(e:ChangeEvent<HTMLInputElement>)=>setTitleText(e.target.value)}
                        value={titleText}
                        ref={titleRef}
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-lg border", 
                        errorObj.title.status === ErrorState.BAD ? "border-red-600" : "dark:border-white focus:dark:border-theme-main",
                        "")}
                    />
                </div>

                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                            errorObj.description.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"
                        )}><FaFileLines /></span>
                        <span>Task description <span className={"text-red-600"}>{errorObj.description.status === ErrorState.BAD ? `: ${errorObj.description.error}` : ""}</span></span>
                    </span>

                    <textarea
                        name=""
                        id=""
                        cols={30}
                        placeholder="Enter a short description of the task..."
                        rows={5}
                        ref={descriptionRef}
                        onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>setDescriptionText(e.target.value)}
                        value={descriptionText}
                        style={{ resize: "none" }}
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-lg border", 
                        errorObj.description.status === ErrorState.BAD ? "border-red-600" : "dark:border-white focus:dark:border-theme-main",
                        "resize-none")}
                    ></textarea>
                </div>

                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                            errorObj.assignees.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"
                        )}><FaUserPlus /></span>
                        <span>Task assignees <span className="opacity-50">(max of 10)</span> <span className={"text-red-600"}>{errorObj.assignees.status === ErrorState.BAD ? `: ${errorObj.assignees.error}` : ""}</span></span>
                    </span>

                    <TaskAssigneeComponent retrieveAssignees={setTaskAssignees} />
                </div>
                
                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                            errorObj.priorityLevel.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"
                        )}><FaTriangleExclamation /></span>
                        <span>Task priority level <span className={"text-red-600"}>{errorObj.priorityLevel.status === ErrorState.BAD ? `: ${errorObj.priorityLevel.error}` : ""}</span></span>
                    </span>

                    <RadioButtonGroup retrieveData={setPriorityLevel} options={priorityArray} />
                </div>
            </div>

            <button
                type={(canSubmit && !loading) ? "submit" : "button"}
                className={clsx(
                    "outline-none w-full py-2 px-3 rounded-lg",
                    canSubmit ? "hover:text-theme-white-dark active:scale-90 hover:bg-theme-main hover:border-transparent" : "opacity-50 grayscale cursor-default",
                    loading ? "cursor-wait border border-theme-main grid place-items-center" : "border border-theme-main text-theme-main"
                )}
            >
                <ShowElement.when isTrue={!loading}>
                    <span>
                        Create task
                    </span>
                </ShowElement.when>
                <ShowElement.when isTrue={loading}>
                    <span>
                        <Image
                            src={"https://taskify.sirv.com/three-dots.svg"}
                            alt="loading"
                            height={80}
                            width={80}
                            className="object-contain w-6 h-auto py-2 dark:invert-0 invert"
                        />
                    </span>
                </ShowElement.when>
            </button>
            <button type="reset" hidden ref={resetRef}></button>
        </form >
    );
}

type AssigneeOption = Assignee & {
    selected: boolean
}

const TaskAssigneeComponent = ({retrieveAssignees}: {retrieveAssignees: Dispatch<SetStateAction<string[]>>}) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [addedAssignees, setAddedAssignees] = useState<Assignee[]>([]);
    const [assigneesOptions, setAssigneesOptions] = useState<AssigneeOption[]>([]);
    const [assigneesOptionsDisplay, setAssigneesOptionsDisplay] = useState<AssigneeOption[]>([]);
    const [inputOnFocus, setInputOnFocus] = useState<boolean>(false);

    const platformRef = useRef<HTMLDivElement>(null);

    const [displayList, setDisplayList] = useState<Assignee[]>([]);
    const teamList = useSelector(echoDisplayList);

    useEffect(() => {
        if (!teamList) return;

        const assigneeList: Assignee[] = []

        teamList.map((team)=>{
            const assigneeObj: Assignee = {
                avatar: team.profileAvatar,
                id: team.userId,
                userName: team.name
            };

            assigneeList.push(assigneeObj);
        });

        setDisplayList(assigneeList);
    }, [teamList]);
    
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        const getIds: string[] = [];
        addedAssignees.forEach((assignee) => {
            getIds.push(assignee.id);
        })
        retrieveAssignees(getIds);
    }, [addedAssignees, retrieveAssignees]);
    
    const reachedLimit = addedAssignees.length === 10;
    const showPlatform = ((debouncedSearchQuery.length > 0) || inputOnFocus) && !reachedLimit;

    useEffect(() => {
        const newList: AssigneeOption[] = [];
        displayList.forEach((assignee)=>{
            newList.push({...assignee, selected: false});
        });

        setAssigneesOptions(newList);
    }, [displayList]);

    
    const clearSearchQuery = () => {
        setSearchQuery("");
        setInputOnFocus(false);
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

    const handleOnBlur = () =>{
        setInputOnFocus(false);
    }

    useEffect(() => {
        if (debouncedSearchQuery === "") {
            if (inputOnFocus){
                setAssigneesOptionsDisplay(assigneesOptions);
                return;
            }
            return;
        };

        const searchResult = assigneesOptions.filter(option => option.userName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
        setAssigneesOptionsDisplay(searchResult);
    }, [debouncedSearchQuery, assigneesOptions, inputOnFocus]);
    

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
                        onFocus={()=>setInputOnFocus(true)}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </ShowElement.when>
            </div>

            <ShowElement.when isTrue={showPlatform}>
                <div onMouseLeave={handleOnBlur} ref={platformRef} className={clsx("absolute z-10 backdrop-blur-sm overflow-hidden bg-black/5 shadow left-0 mt-3 w-full rounded-xl flex flex-col gap-3 border border-white/25")}>
                    <div className="flex justify-between items-center p-3 pb-2 border-b bg-white/10 border-b-white/10">
                        <span>Members</span>
                        <span onClick={clearSearchQuery} className={"text-sm hover:text-red-600 cursor-pointer"}>
                            <FaX />
                        </span>
                    </div>
                    <ShowElement.when isTrue={assigneesOptionsDisplay.length > 0}>
                        <div className="grid overflow-y-auto max-h-[15rem] px-3">
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



interface RadioButtonGroupProps {
    options: Priority[];
    retrieveData: Dispatch<SetStateAction<Priority>>;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ options, retrieveData }) => {
    function isPriority(value: any): value is Priority {
        return Object.values(Priority).includes(value);
    }

    const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as Priority;

        if (isPriority(value)) {
            retrieveData(value);
        } else {
            retrieveData(Priority.NONE);
        }

    }

    return (
        <div className="relative flex flex-wrap">
            {options.map((option, index) => (
                <div key={index} role="button" className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start hover:bg-theme-main/10 hover:bg-opacity-80 hover:text-white focus:bg-theme-main focus:bg-opacity-80 focus:text-white active:bg-theme-main active:bg-opacity-80 active:text-white max-w-[50%]">
                    <label htmlFor={`vertical-list-${option}`} className="flex gap-2 items-center w-full px-3 py-2 cursor-pointer">
                        <div className="grid mr-3 place-items-center">
                            <div className="inline-flex items-center">
                                <label className="relative flex items-center p-0 rounded-full cursor-pointer" htmlFor={`vertical-list-${option}`}>
                                    <input
                                        name="vertical-list"
                                        id={`vertical-list-${option}`}
                                        type="radio"
                                        onChange={handleRadioChange}
                                        value={option}
                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-theme-main text-theme-main transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-theme-main before:opacity-0 before:transition-opacity checked:border-theme-main checked:before:bg-theme-main hover:before:opacity-0 peer"
                                    />
                                    <span className="absolute text-theme-main transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                                            <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                        </svg>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <p className={clsx("block font-sans text-base antialiased font-medium leading-relaxed")}>
                            {option}
                        </p>
                    </label>
                </div>
            ))}
        </div>
    );
}