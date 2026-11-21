import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { PROTECTED_PREFIXES } from "@/lib/routes"

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "") || "/"
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "")

  const isProtected = PROTECTED_PREFIXES.some((route) => pathname.startsWith(route))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (token && ["/", "/login"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard",
    "/customers/:path*",
    "/organizations/:path*",
    "/packages/:path*",
    "/payments/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/sessions/:path*",
    "/profile/:path*",
    "/expenses/:path*",
    "/complaints/:path*",
    "/reports/:path*",
    "/payment-requests/:path*",
    "/sms/:path*",
    "/audit/:path*",
    "/receipt/:path*",
    "/billing/:path*",
    "/platform/:path*",
  ],
}
