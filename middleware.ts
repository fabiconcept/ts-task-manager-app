import { NextRequest, NextResponse } from "next/server";
import { ValidateAuthResponseWithError, ValidateAuthResponseWithoutError } from "./lib/Types";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { decryptValue, encryptValue } from "./lib/session";

const verifyLogin = async (cookieData: RequestCookie): Promise<[true, string] | [false, {error: string}]> =>{
    const apiURL = "http://localhost:3000/api/authentication/validateAuth";

    try {
        if (!cookieData) {
            throw new Error("Session data not found");
        }

        const cookie = decryptValue(`${cookieData.value}`);

        const req = await fetch(apiURL, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                authenticationKey: cookie
            })
        })

        const res: ValidateAuthResponseWithError | ValidateAuthResponseWithoutError<string> = await req.json();
        const { status, message } = res;

        if(status === 400) {
            throw new Error(message);
        }else {
            return [true, res.data];
        }

    } catch (error) {
        return [false, {error: `${error}`}];
    }

}

export async function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const getCookie = request.cookies.get("taskerId")!;

    if (pathName.startsWith("/dashboard")) {
        if (!getCookie) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (pathName.startsWith("/dashboard/project")) {
            if(pathName === "/dashboard/project") return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        const [test, response] = await verifyLogin(getCookie);

        if (!test) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const responseCookies = NextResponse.next();
        responseCookies.cookies.set("taskerUser", encryptValue(response));

        return responseCookies;   
    }

    if (pathName.startsWith("/login") || pathName.startsWith("/signin")) {
        return NextResponse.rewrite(new URL("/auth/login", request.url));
    }
    
    if (pathName.startsWith("/register") || pathName.startsWith("/signup")) {
        return NextResponse.rewrite(new URL("/auth/", request.url));
    }


    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        "/auth/:path*", 
        "/dashboard/:path*",
    ],
}