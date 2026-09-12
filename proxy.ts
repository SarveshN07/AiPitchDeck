import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  if (request.auth) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.nextUrl.origin);
  loginUrl.searchParams.set("callbackUrl", "/create");
  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: ["/create", "/decks/:path*", "/deck/:path*"],
};