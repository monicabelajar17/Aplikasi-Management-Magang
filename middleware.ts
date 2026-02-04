import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("user_id")?.value

  const response = NextResponse.next()

  if (userId) {
    response.headers.set("x-user-id", userId)
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*"]
}
