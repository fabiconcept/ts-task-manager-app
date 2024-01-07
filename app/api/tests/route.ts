import connectDatabase from "@/lib/Database";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";



const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("id")!;


    const client = await connectDatabase();
    const db = client.db("taskify");

    const findUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    return NextResponse.json({findUser});
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