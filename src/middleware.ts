import { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    const url = req.nextUrl
    const hostname = req.headers.get("host") || ""

    // Cek apakah ini link admin (misal: admin.domain.com, admin-website.vercel.app, atau link-admin.vercel.app)
    const isAdminDomain = 
      hostname.startsWith("admin.") || 
      hostname.startsWith("admin-") || 
      hostname.includes("-admin") ||
      hostname.includes("admin.")

    if (isAdminDomain) {
      // Jika buka root (/) di link admin, arahkan ke dashboard admin
      if (url.pathname === "/") {
        return NextResponse.rewrite(new URL("/admin/dashboard", req.url))
      }
    }
    
    return NextResponse.next()
  },
  {
    pages: {
      signIn: "/admin/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        // Hanya halaman admin yang butuh token
        if (req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.includes("/login")) {
          return !!token
        }
        return true
      }
    }
  }
)

export const config = { 
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
