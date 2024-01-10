import connectDatabase from "@/lib/Database";   
import { AuthResponseType } from "@/lib/Enums";
import { RequestBody, ResponseWithError, ResponseWithoutError } from "@/lib/Types";
import { comparePassword, generateSalt, hashPassword } from "@/lib/encryption";
import { realEscapeString } from "@/lib/utilities";
import { NextResponse } from "next/server";

interface ReqBody extends Pick<RequestBody, "email" | "password"> {
    exp?: number,
}

let message : ResponseWithError | ResponseWithoutError

export const POST = async (request: Request) => {
    const reqBody: ReqBody  = await request.json();

    const { email, password, exp } = reqBody;

    if (!email) {
        message = {
            status: 400,
            type: AuthResponseType.EmailError,
            message: "Email is required!"
        }
        return NextResponse.json(message);
    }

    if (!password) {
        message = {
            status: 400,
            type: AuthResponseType.PasswordError,
            message: "Password is required!"
        }
        return NextResponse.json(message);
    }

    const cleanEmail = realEscapeString(email);

    try {
        const client = await connectDatabase();
        
        if(!client) {
            throw new Error("Failed to connect to Database");
        }

        const db = client.db("taskity");
        const accountsCollection = db.collection("Accounts");

        const findUser = await accountsCollection.findOne({
            email: cleanEmail
        });

        if (!findUser) {
            message = {
                status: 400,
                type: AuthResponseType.InvalidError,
                message: "Email or Password is invalid!"
            }
            return NextResponse.json(message);
        }

        const checkPassword = comparePassword(password, findUser.password, findUser.userSalt);

        if (!checkPassword) {
            message = {
                status: 400,
                type: AuthResponseType.InvalidError,
                message: "Email or Password is invalid!"
            }
            return NextResponse.json(message);
        }
        const loginAuthKey = generateSalt();
        const loginExpTime = (new Date()).getTime() + (exp ? exp : (60 * 60 * 1000));
        
        const authentication = {
            key: loginAuthKey,
            exp: loginExpTime
        }

        accountsCollection.updateOne(
            {
                email: cleanEmail
            },
            {
                $set: { authentication } 
            },
        )

        message = {
            status: 200,
            type: AuthResponseType.NoError,
            message: { 
                userId: findUser.userId, 
                auth: authentication.key
            }
        }
        return NextResponse.json(message)

    } catch (error) {
        message = {
            status: 400,
            type: AuthResponseType.UnknownError,
            message: `An error occurred! ${error}`
        }
        return NextResponse.json(message);
    }
}