import { TeamMember, UserProject } from "../Types";

export interface UiWithChildren {
    children: React.ReactNode
}

export interface UserAccount {
    name: string;
    email: string;
    userId: string;
    userSalt: string;
    password: string;
    authentication: {
        key: string;
        exp: number
    }
}
export interface UserAccountDetails {
    userId: string,
    displayName: string,
    profileAvatar: string,
    name: string,
    email: string,
    projects: UserProject[],
    defaultProject: string,
    created_on: string,
}

export interface TaskerProfile {
    profile_id: string;
    name: string;
    avatar: string;
    owner: string;
    team: TeamMember[];
    updated_on: string;
    created_on: string;
}

export interface UserAccountWithId extends UserAccount {
    id: string
}

export interface UserDetails extends Pick<UserAccount, "name" | "email" | "userId" > {
    displayName: string;
    profileAvatar: string;
}

// web socket set up
