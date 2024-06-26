export enum testSwitch {
    IDLE = 0,
    FAILED = 1,
    PASSED = 2
}

export enum AuthResponseType {
    NoError = 0,
    EmailError = 1,
    NameError = 2,
    PasswordError = 3,
    UnknownError= 4,
    InvalidError = 5,
}

export enum loadingState {
    IDLE =  "idle",
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed"
}

export enum ErrorState {
    IDLE =  "idle",
    GOOD = "good",
    BAD = "bad"
}

export enum Priority {
    NONE = "none",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export enum TaskerStatus {
    PENDING = "pending",
    INPROGRESS = "InProgress",
    COMPLETE = "complete"
}

export enum ViewType {
    BOX = "box",
    LIST = "list",
}

export enum SortBy {
    TYPE= "type",
    AZ = "a-z",
    ZA = "z-a",
    JOIN = "join-date"
}

export enum PopupType {
    AddTeam = "addTeam",
    AreYouSure = "areYouSure",
    EditProfile = "editProfile",
    NewProject = "newProject",
    NewTask = "newTask",
    EditTask = "editTask",
}

export enum PutType {
    GENERAL = "general",
    STATUS = "status",
}