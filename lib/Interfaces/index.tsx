import { Priority, TaskerStatus } from "../Enums";
import { TeamMember, UserProject } from "../Types";
import { FunctionProp } from "../Types/dashboard";

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
    teamCount?: number | 0;
    projectsCount: number,
    updated_on: string;
    created_on: string;
}

export interface TaskerProject {
    project_id: string;
    from_id: string;
    title: string;
    description?: string;
    priority: Priority;
    status: TaskerStatus;
    tasksCount: number | 0;
    tasksList: string[];
    membersList: string[];
    membersCount: number;
    created_on: string;
    updated_on: string;
}

export interface TaskerProjectTask {
    task_id: string;
    from_id: string;
    title: string;
    shortDesc: string;
    desc: string;
    priorityLevel: Priority;
    status: TaskerStatus;
    assigneeCount: number | 0;
    assigneeList: TaskTeamProfile[];
    created_on: string;
    last_update: string;
}

export interface TaskTeamProfile {
    user_id: string;
    status: "";
    assignmentDate: string;
}

export interface UserAccountWithId extends UserAccount {
    id: string
}

export interface UserDetails extends Pick<UserAccount, "name" | "email" | "userId" > {
    displayName: string;
    profileAvatar: string;
}

export interface SearchProp {
    performFunction: FunctionProp;
    placeholder: string
}

// web socket set up
