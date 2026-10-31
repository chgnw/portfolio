import { NextResponse, type NextRequest } from "next/server";

/**
 * First line of defence for the dashboard: requests without a session cookie
 * never reach a dashboard page. The cookie itself is verified against the
 * database in every dashboard layout / server action (requireUser), so a
 * forged cookie gets nothing.
 */
const COOKIE_NAMES = ["__Host-pf_session", "pf_session"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/dashboard/login") return NextResponse.next();

  const hasSession = COOKIE_NAMES.some((name) => request.cookies.has(name));
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
