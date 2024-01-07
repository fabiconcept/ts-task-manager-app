import connectDatabase from "@/lib/Database";
import { AuthResponseType } from "@/lib/Enums";
import { RequestBody } from "@/lib/Types";
import { comparePassword, hashPassword } from "@/lib/encryption";
import { realEscapeString } from "@/lib/utilities";
import { NextResponse } from "next/server";



export const POST = async (request: Request) => {
    const reqBody: Pick<RequestBody, "email" | "password"> = await request.json();

    const { email, password } = reqBody;

    if (!email) {
        return NextResponse.json({
            status: 400,
            type: AuthResponseType.EmailError,
            message: "Email is required!"
        });
    }

    if (!password) {
        return NextResponse.json({
            status: 400,
            type: AuthResponseType.PasswordError,
            message: "Password is required!"
        });
    }

    const cleanEmail = realEscapeString(email);

    try {
        const client = await connectDatabase();
        const db = client.db("taskity");
        const accountsCollection = db.collection("Accounts");
        const accountsDetailsCollection = db.collection("AccountsDetails");

        const findUser = await accountsCollection.findOne({
            email: cleanEmail
        });

        if (!findUser) {
            return NextResponse.json({
                status: 400,
                type: AuthResponseType.InvalidError,
                message: "Email or Password is invalid!"
            });
        }

        const hashedPassword = hashPassword(password, findUser.userSalt);

        const checkPassword = comparePassword(password, findUser.password, findUser.userSalt);

        if (!checkPassword) {
            return NextResponse.json({
                status: 400,
                type: AuthResponseType.InvalidError,
                message: "Email or Password is invalid!"
            });
        }

        return NextResponse.json({
            status: 200,
            type: AuthResponseType.NoError,
            message: findUser.userId
        })

    } catch (error) {
        return NextResponse.json({
            status: 400,
            type: AuthResponseType.UnknownError,
            message: `An error occurred! ${error}`
        });
    }
}