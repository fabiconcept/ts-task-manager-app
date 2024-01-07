export interface UiWithChildren {
    children: React.ReactNode
}

export interface UserAccount {
    name: string;
    email: string;
    userId: string;
    userSalt: string;
    password: string;
}

export interface UserDetails extends Pick<UserAccount, "name" | "email" | "userId" > {
    displayName: string;
    profileAvatar: string;
}