import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
        const session = req.auth;
        const { pathname } = req.nextUrl;

        const isLoggedIn = !!session?.user;

        if ((pathname === "/" || pathname === "/profile") && !isLoggedIn) {
                return NextResponse.redirect(new URL("/login", req.nextUrl));
        }

        if (pathname === "/login" && isLoggedIn) {
                return NextResponse.redirect(new URL("/", req.nextUrl));
        }

        return NextResponse.next();
});

export const config = {
        matcher: ["/", "/profile", "/login"],
};
