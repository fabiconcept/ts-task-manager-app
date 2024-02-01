import { TaskerProfile, TaskerProject, UserAccountDetails} from "../Interfaces";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "../Types";
import { CompanyTag } from "../Types/dashboard";
// : UserDetails

export const getUserData = async (key: string) => {
    const getResponse: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<UserAccountDetails> = await fetch("/api/dashboard/userData", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            key
        }),
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

export async function getProjects(taskerProjectIds: string[]): Promise<{ response: boolean, resultProjects: TaskerProject[], message: string }> {
    const sendRequest = await fetch("/api/dashboard/taskerProfiles/projects", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({project_ids: taskerProjectIds}),
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