import connectDatabase from "@/lib/Database";
import { UserAccount } from "@/lib/Interfaces";
import { RequestBody } from "@/lib/Types";
import { generateSalt, hashPassword } from "@/lib/encryption";
import { generateUniqueId, realEscapeString, validateEmail, validateFullName, validatePassword } from "@/lib/utilities";
import { NextResponse } from "next/server";



export const POST = async (request: Request) => {
    const reqBody: RequestBody = await request.json();
    const { email, name, password } = reqBody;

    if (!validateEmail(email)) {
        return NextResponse.json({
            status: 400,
            type: 1,
            message: "Invalid Email"
        });
    }
    
    if (!validateFullName(name)[0]) {
        return NextResponse.json({
            status: 400,
            type: 2,
            message: "Invalid name"
        });
    }
    
    if (!validatePassword(password)[0]) {
        return NextResponse.json({
            status: 400,
            type: 3,
            message: "Invalid password format"
        });
    }

    try {
        const client = await connectDatabase();
        const db = client.db("taskity");

        const accountsCollection = db.collection("Accounts");
        const accountsDetailsCollection = db.collection("AccountsDetails");

        const UserId = generateUniqueId();
        const cleanEmail = realEscapeString(email);
        const cleanName = realEscapeString(name);
        const userSalt = generateSalt();
        const hashedPassword = hashPassword(password, userSalt);

        const payload = {
            userId: UserId,
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            userSalt: userSalt
        } satisfies UserAccount;

        const splitName = payload.name.split(" ");

        // check if email exist
        const emailExist = await accountsCollection.findOne({email: payload.email});

        if (emailExist) {
            return NextResponse.json({
                status: 400,
                type: 1,
                message: "User already exist!"
            });
        }

        // Create user account
        await accountsCollection.insertOne(payload);

        // Create user account details
        await accountsDetailsCollection.insertOne({
            userId: payload.userId,
            displayName: `${splitName[0][0]}${splitName[1][0]}`,
            profileAvatar: ""
        });
        return NextResponse.json({ 
            status: 200, 
            type: 0,
            message: "Account successfully created ✨!" 
        });
    } catch (error) {
        return NextResponse.json({ 
            status: 400, 
            type: 4,
            message: `An error occurred! ${error}` 
        });
    }   
}