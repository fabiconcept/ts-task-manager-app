import connectDatabase from "@/lib/Database";
import { AuthResponseType } from "@/lib/Enums";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "@/lib/Types";
import { NextResponse } from "next/server";

type ReqBody = {
    authenticationKey: string
}

let apiResponse : ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<{}>

export const POST = async (req: Request) => {
    const { authenticationKey }: ReqBody = await req.json();
    const now = new Date().getTime();

    if (!authenticationKey) {
        apiResponse = {
            status: 400,
            type: AuthResponseType.InvalidError,
            message: "Invalid Request"
        } 
        return NextResponse.json(apiResponse);
    }

    const splitAuthenticationKey = authenticationKey.split(" ");
    const userId = splitAuthenticationKey[0];
    const userAuthenticationKey = splitAuthenticationKey[1];

    if (!userId || !userAuthenticationKey) {
        apiResponse = {
            status: 400,
            type: AuthResponseType.InvalidError,
            message: "Invalid Request"
        }
        return NextResponse.json(apiResponse);
    }


    try {
        const client = await connectDatabase();
        const db = client.db("taskity");
        const accountsCollection = db.collection("Accounts");
        const accountsDetailsCollection = db.collection("AccountsDetails");


        const findUser = await accountsCollection.findOne({
            userId: userId
        });

        if (!findUser) {
            apiResponse = {
                status: 400,
                type: AuthResponseType.InvalidError,
                message: "Bad request - Unknown user"
            }
            return NextResponse.json(apiResponse);
        }

        const getUserAuthObject: {key: string, exp: number} = findUser.authentication;

        if (getUserAuthObject.key !== userAuthenticationKey) {
            apiResponse = {
                status: 400,
                type: AuthResponseType.InvalidError,
                message: `Bad request - Invalid AuthenticationKey`
            }
            return NextResponse.json(apiResponse);
        }
        
        if (now > getUserAuthObject.exp) {
            apiResponse = {
                status: 400,
                type: AuthResponseType.InvalidError,
                message: `Bad request - Session expired ${now} ${getUserAuthObject.exp}`
            }
            return NextResponse.json(apiResponse);
        }

        const getUserData = await accountsDetailsCollection.findOne({
            userId: userId
        });


        apiResponse = {
            status: 200,
            type: AuthResponseType.NoError,
            message: "Authentication successful",
            data: {...getUserData}
        }
        return NextResponse.json(apiResponse);

    } catch (error) {
        apiResponse = {
            status: 400,
            type: AuthResponseType.InvalidError,
            message: "Failed to fetch"
        }
        return NextResponse.json(apiResponse);
    }
    

    return NextResponse.json({
        status: 200,
        authenticationKey
    })
}