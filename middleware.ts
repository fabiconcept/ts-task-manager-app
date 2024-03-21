import { NextRequest, NextResponse } from "next/server";
import { retrieveActiveSession } from "./lib/session/helper";

export function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;

    if (pathName.startsWith("/login") || pathName.startsWith("/signin")) {
        return NextResponse.rewrite(new URL("/auth/login", request.url));
    }
    
    if (pathName.startsWith("/register") || pathName.startsWith("/signup")) {
        return NextResponse.rewrite(new URL("/auth/", request.url));
    }


    return NextResponse.json({
        request
    });
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        "/auth/:path*", 
        "/dashboard/:path*",
    ],
}