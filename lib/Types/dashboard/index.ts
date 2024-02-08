export type CompanyTag = {
    id: string,
    username: string,
    abbr: string,
    avatar?: string;
}

export type FunctionProp = (prop?: any) => void;