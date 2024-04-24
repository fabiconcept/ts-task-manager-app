import { SortBy } from "../Enums";
import { TaskerProfile, TaskerProject, TaskerProjectTask, UserAccountDetails} from "../Interfaces";
import { TeamMember, ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "../Types";
import { CompanyTag } from "../Types/dashboard";

// : UserDetails
export const getUserData = async (key: string) => {
    const getResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<UserAccountDetails> = await fetch("/api/dashboard/userData", {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "userKey": key,
        },
        next: { revalidate: 60 },
    }).then((res) => {
        if (!res.ok) {
            throw new Error("Failed to fetch user data.");
        }

        return res.json();
    })

    if (getResponse.status === 400) {
        throw new Error(getResponse.message);
    }

    return getResponse
}

export async function getProfiles(taskerProfileIds: string[]): Promise<{ response: boolean, resultTag: CompanyTag[], resultProfiles: TaskerProfile[], message: string }> {
    const sendRequest = await fetch("/api/dashboard/taskerProfiles", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({key: taskerProfileIds}),
    });

    const data: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<TaskerProfile[]> = await sendRequest.json();

    const { status, message } = data;
    let response = false;
    let resultTag: CompanyTag[] = [];
    let resultProfiles: TaskerProfile[] = [];

    if (status === 200) {
        resultProfiles = data.data;
        const myTaskerProfiles = resultProfiles.map((profile)=> {
            const companyProfile: CompanyTag = {
                abbr: (profile.name).split("").splice(0, 2).join(""),
                username: profile.name,
                avatar: profile.avatar,
                id: profile.profile_id,
            }

            return companyProfile;
        });

        resultTag = [...myTaskerProfiles];
        response = true;

    }
    
    
    return {response, resultTag, resultProfiles, message};
}

export async function getProjects(taskerProfileId: string): Promise<{ response: boolean, resultProjects: TaskerProject[], message: string }> {
    const sendRequest = await fetch("/api/dashboard/taskerProfiles/projects", {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            'Authorization': taskerProfileId
        },
    });

    const data: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<TaskerProject[]> = await sendRequest.json();

    const { status, message } = data;

    let response = false;
    let resultProjects: TaskerProject[] = [];

    if (status === 200) {
        resultProjects = data.data;
        response = true;
    }
    
    
    return { response, resultProjects, message };
}

export const performSearch = (searchString: string, teamList: UserAccountDetails[]) => {
    const searchText = searchString.toLowerCase();

    const newList = teamList.filter((member) => (
        Object.values(member).some((value) => typeof value === "string" && value.toLowerCase().includes(searchText))
    ));

    return newList;
}

export const toggleSortBy = (currentSort: number): number => {
    const sortByEnum = Object.values(SortBy);
    if (currentSort === (sortByEnum.length - 1)) {
        return 0;
    }
    currentSort++
    return currentSort;
}

// Handle the sorting on the CompantIntro Team Page
export const performSortingForTeamList = (sortBy: SortBy, arrayToSort: UserAccountDetails[], helperArray?: TeamMember[]): UserAccountDetails[] => {
    const newArrayToSort = [...arrayToSort];

    switch (sortBy) {
        case SortBy.TYPE:
            // Sort based on TYPE using helperArray
            if (helperArray) {
                return newArrayToSort.sort((a, b) => {
                    // Find the TeamMember corresponding to each UserAccountDetails
                    const typeA = helperArray.find((member) => member.user_id === a.userId)?.type || 'none';
                    const typeB = helperArray.find((member) => member.user_id === b.userId)?.type || 'none';

                    // Define the order in which types should appear
                    const typeOrder = { owner: 0, editor: 1, worker: 2, none: 3 };

                    // Use localeCompare for string comparison based on defined order
                    return typeOrder[typeA] - typeOrder[typeB];
                });
            }
            return newArrayToSort;

        case SortBy.JOIN:
            // Sort based on JOIN using helperArray
            if (helperArray) {
                return newArrayToSort.sort((a, b) => {
                    const joinedA = helperArray.find((member) => member.user_id === a.userId)?.joined_on || '';
                    const joinedB = helperArray.find((member) => member.user_id === b.userId)?.joined_on || '';
                    return joinedA.localeCompare(joinedB);
                });
            }
            return newArrayToSort;

        case SortBy.AZ:
            // Sort alphabetically A-Z based on name property
            return newArrayToSort.sort((a, b) => a.name.localeCompare(b.name));

        case SortBy.ZA:
            // Sort alphabetically Z-A based on name property
            return newArrayToSort.sort((a, b) => b.name.localeCompare(a.name));

        default:
            // Default: return the array as is
            return newArrayToSort;
    }
};
  

// Projects activity
// @GET
export async function getProject(taskerProjectId: string)/*: Promise<{ response: boolean, result: TaskerProject, message: string }>*/ {
    const sendRequest = await fetch("api/dashboard/Projects", {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "project_key": taskerProjectId,
        }
    });

    const data: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<TaskerProfile[]> = await sendRequest.json();

    const { status, message } = data;
    console.log({ status, message });
}
// @POST
export async function createProject(payload: TaskerProject)/*: Promise<{ response: boolean, result: TaskerProject, message: string }>*/ {
    const sendRequest = await fetch("api/dashboard/Projects", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({payload}),
    });

    const data: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<TaskerProfile[]> = await sendRequest.json();

    const { status, message } = data;
    if (status === 400) {
        throw new Error(message);
    }
}

// Team activities
export async function inviteTeamMember(payload: { email: string, profile_id: string }): Promise<string>{
    const sendRequest = await fetch("api/dashboard/taskerProfiles/team", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<TaskerProfile[]> = await sendRequest.json();
    const { status, message } = data;

    if (status === 400) {
        throw new Error(message);
    }

    return message;
}

// Team activities
export async function updateTaskerProfileInformation(payload: {profile_id: string, name: string, avatar: string, bio: string}): Promise<string>{
    const sendRequest = await fetch("api/dashboard/taskerProfiles", {
        method: "put",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({payload}),
    });

    const data: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<TaskerProfile[]> = await sendRequest.json();
    const { status, message } = data;

    if (status === 400) {
        throw new Error(message);
    }

    return message;
}

// Create a new task
export async function createNewtask(payload: TaskerProjectTask): Promise<string> {
    const sendRequest = await fetch("/api/dashboard/taskerProfiles/task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({payload}),
    });

    const data: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<TaskerProfile[]> = await sendRequest.json();
    const { status, message } = data;

    if (status === 400) {
        throw new Error(message);
    }

    return message;
}

// fetch all the Tasks for a particular project
export async function fetchProjectTasks(projectId: string): Promise<{ tasksResult: TaskerProjectTask[], project_id: string }> {
    const sendRequest = await fetch("/api/dashboard/taskerProfiles/task", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "projectId": `${projectId}`
        },
    });

    const response: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<{ tasksResult: TaskerProjectTask[], project_id: string }> = await sendRequest.json();
    const { status, message } = response;

    if (status === 400) {
        throw new Error(message);
    }

    return response.data;
}

// fetch a particular Task
export async function fetchTask(taskId: string): Promise<TaskerProjectTask> {
    const sendRequest = await fetch("/api/dashboard/taskerProfiles/task", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "taskId": `${taskId}`
        },
    });

    const response: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<TaskerProjectTask> = await sendRequest.json();
    const { status, message } = response;

    if (status === 400) {
        throw new Error(message);
    }

    return response.data;
}