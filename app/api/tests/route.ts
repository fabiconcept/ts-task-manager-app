// import { TestSchema } from "@/lib/Database/schemas";
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
    return NextResponse.json({res, req});
}

export { GET, POST }