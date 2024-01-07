// import { TestSchema } from "@/lib/Database/schemas";
import connectDatabase from "@/lib/Database";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";



const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
 
    // const name = searchParams.get("name");
    // const instrument = searchParams.get("instrument");

    const obj = Object.fromEntries(searchParams.entries());

    return NextResponse.json(obj);
    // return NextResponse.json({name, instrument});
}

const POST = async (res: Response, req: Request) => {
    try {
        const client = await connectDatabase();
        const db = client.db("taskify");

        const usersCollection = await db.collection("users").insertOne({
            name: "Fabian Ajokubi",
            email: "favourajokubi@gmail.com",
            password: "aloha8520**"
        })

        return NextResponse.json(usersCollection);
    } catch (error) {
        return new NextResponse(`An error occured ${error}`);
    }
}

export { GET, POST }