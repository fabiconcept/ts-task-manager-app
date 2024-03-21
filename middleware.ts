import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const getCookie = request.cookies.get("taskerId");

    if (!getCookie) {
        return NextResponse.rewrite(new URL("/auth/login", request.url));
    }else{
        console.log(getCookie);
    }

    if (pathName.startsWith("/login") || pathName.startsWith("/signin")) {
        return NextResponse.rewrite(new URL("/auth/login", request.url));
    }
    
    if (pathName.startsWith("/register") || pathName.startsWith("/signup")) {
        return NextResponse.rewrite(new URL("/auth/", request.url));
    }


    return NextResponse.json({
        cookie: getCookie,
    });
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        "/auth/:path*", 
        "/dashboard/:path*",
    ],
}