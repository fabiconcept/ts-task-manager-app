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