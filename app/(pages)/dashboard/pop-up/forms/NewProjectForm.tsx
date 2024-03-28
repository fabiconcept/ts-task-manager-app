"use client"
import { ErrorState, Priority } from "@/lib/Enums";
import { useDebounce } from "@/lib/Hooks/useDebouce";
import { TaskerProject } from "@/lib/Interfaces";
import { realEscapeString } from "@/lib/utilities";
import clsx from "clsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { FaFileLines, FaHeading, FaPlus, FaTriangleExclamation } from "react-icons/fa6";

interface RadioButtonGroupProps {
    options: Priority[];
    retrieveData: Dispatch<SetStateAction<Priority>>;
}

interface ErrorStateObj {
    status: ErrorState;
    error: string;
}

interface ErrorObj {
    [key: string]: ErrorStateObj; // Index signature
}

function isPriority(value: any): value is Priority {
    return Object.values(Priority).includes(value);
}

interface NewProject extends Pick<TaskerProject, "title" | "description" | "priority"> { };


export default function NewProjectForm() {
    const [titleText, setTitleText] = useState<string>("");
    const [descriptionText, setDescriptionText] = useState<string>("");
    const [priorityLevel, setPriorityLevel] = useState<Priority>(Priority.NONE);
    
    const [errorObj, setErrorObj] =  useState<ErrorObj>({
        title: { status: ErrorState.IDLE, error: "" },
        description: { status: ErrorState.IDLE, error: "" },
        priorityLevel: { status: ErrorState.IDLE, error: "" },
    });
    
    const titleDebounce = useDebounce(titleText, 500);
    const descriptionDebounce = useDebounce(descriptionText, 500);

    useEffect(() => {
        if(!titleDebounce) {
            setErrorObj((error)=>({...error, title: {status: ErrorState.IDLE, error: ""}}));
            return;
        };

        setErrorObj((error)=>({...error, title: {status: ErrorState.GOOD, error: ""}}));
        
    }, [titleDebounce]);
    
    useEffect(() => {
        if(!descriptionDebounce) {
            setErrorObj((error)=>({...error, description: {status: ErrorState.IDLE, error: ""}}));
            return;
        };

        setErrorObj((error)=>({...error, description: {status: ErrorState.GOOD, error: ""}}));
    }, [descriptionDebounce]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        function areAllStatusGood(): boolean {
            for (const key in errorObj) {
                console.log(key);
                if (errorObj[key].status !== ErrorState.GOOD) {
                    return false;
                }
            }
            return true;
        }

        if (!areAllStatusGood) {

        }

        const formData: NewProject = {
            title: realEscapeString(titleDebounce),
            description: realEscapeString(descriptionDebounce),
            priority: priorityLevel,
        }

        console.log(formData);
    }
    const priorityArray: Priority[] = [Priority.NONE, Priority.LOW, Priority.MEDIUM, Priority.HIGH];

    return (
        <form onSubmit={handleSubmit} className={clsx("flex flex-col gap-6")}>
            <div className="flex items-center gap-2 text-xl font-semibold pb-4 border-b dark:border-b-white/10 border-b-black/10"> <span className="opacity-50 text-theme-main"><FaPlus /></span> New project</div>
            <div className={"flex flex-1 overflow-y-auto flex-col gap-6 pb-6"}>
                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                            errorObj.title.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"
                        )}><FaHeading /></span>
                        <span>Project title</span>
                    </span>
                    <input
                        type="text"
                        placeholder="Pick something funny"
                        onChange={(e:ChangeEvent<HTMLInputElement>)=>setTitleText(e.target.value)}
                        required
                        value={titleText}
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-lg border dark:border-white focus:dark:border-theme-main")}
                    />
                </div>
                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                            errorObj.description.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"
                        )}><FaFileLines /></span>
                        <span>Project description</span>
                    </span>

                    <textarea
                        name=""
                        id=""
                        cols={30}
                        placeholder="Enter a short description of the project..."
                        rows={5}
                        value={descriptionText}
                        onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>setDescriptionText(e.target.value)}
                        style={{ resize: "none" }}
                        className={clsx("bg-transparent outline-none w-full py-2 px-3 rounded-lg border dark:border-white focus:dark:border-theme-main resize-none")}
                    ></textarea>
                </div>
                <div className={clsx("flex flex-col gap-3")}>
                    <span className="flex items-center gap-2 opacity-70">
                        <span className={clsx(
                            "text-sm",
                            errorObj.priorityLevel.status === ErrorState.BAD ? "text-red-600" : "text-theme-main"
                        )}><FaTriangleExclamation /></span>
                        <span>Priority Level</span>
                    </span>
                    <RadioButtonGroup retrieveData={setPriorityLevel} options={priorityArray} />
                </div>
            </div>

            <button
                type="submit"
                className={clsx("hover:bg-theme-main hover:border-transparent outline-none w-full py-2 px-3 rounded-lg border border-theme-main text-theme-main hover:text-theme-white-dark active:scale-90")}
            >
                Publish
            </button>
        </form>
    )
}



const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ options, retrieveData }) => {

    const handleRadioChange = (e:ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as Priority;

        if(isPriority(value)) {
            retrieveData(value);
        }else{
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