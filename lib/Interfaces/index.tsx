import { UniqueIdentifier } from "@dnd-kit/core";
import { ErrorState, Priority, PutType, TaskerStatus } from "../Enums";
import { TeamMember, UserProject } from "../Types";
import { FunctionProp } from "../Types/dashboard";

export interface UiWithChildren {
    children: React.ReactNode
}

export interface SirvCredentials {
    clientId: string;
    clientSecret: string;
  }

interface ErrorStateObj {
    status: ErrorState;
    error: string;
}
export interface ErrorObj {
    [key: string]: ErrorStateObj; // Index signature
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
    bio: string;
    avatar: string;
    owner: string;
    ownerEmail: string;
    team: TeamMember[];
    teamCount: number | 0;
    projectsCount: number,
    invitedTeam: string[];
    invitedTeamCount: number;
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

export interface TaskerProjectTask <T = string> {
    task_id: T;
    from_id: string;
    title: string;
    shortDesc: string;
    desc: string;
    priorityLevel: Priority;
    status: TaskerStatus;
    assigneeCount: number | 0;
    assigneeList: string[];
    created_on: string;
    last_update: string;
}

export interface TaskerProjectTaskUpdatables {
    title: string;
    shortDesc: string;
    desc: string;
    priorityLevel: Priority;
    status: TaskerStatus;
    assigneeCount: number;
    assigneeList: string[];
    last_update: string;
}

export interface TaskerProjectTaskWithId extends TaskerProjectTask {
    id: string
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

export interface TaskerInvite {
    code: string;
    invited_to: string;
    invited_email: string;
    exp_date: string;
}

interface PutPayload {
    taskId: string,
    putType: PutType,
}

export interface PutPayload_Status extends PutPayload {
    putType: PutType.STATUS,
    payload: TaskerStatus,
}

export interface PutPayload_General extends PutPayload {
    putType: PutType.GENERAL,
    payload: TaskerProjectTaskUpdatables,
}

// web socket set up
