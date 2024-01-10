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

export interface UserAccountWithId extends UserAccount {
    id: string
}

export interface UserDetails extends Pick<UserAccount, "name" | "email" | "userId" > {
    displayName: string;
    profileAvatar: string;
}

// web socket set up
