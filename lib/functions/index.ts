import { UserAccountDetails} from "../Interfaces";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "../Types";
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