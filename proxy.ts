import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const ONBOARDING_ROUTES = ["/integrations", "/colocations/creer", "/i"];
const CSRF_COOKIE = "nc_csrf";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const requiresProtection = !pathname.startsWith("/api") && !pathname.startsWith("/_next");

  const respond = (response: NextResponse) => ensureCsrfCookie(request, response);

  if (!requiresProtection) {
    return respond(NextResponse.next());
  }

  const sessionToken = request.cookies.get("nc_session")?.value;
  const metaCookie = request.cookies.get("nc_session_meta")?.value;
  const hasActiveHousehold = metaCookie ? safeParseMeta(metaCookie)?.hasHousehold : false;

  if (!sessionToken && !isAuthRoute && !pathname.startsWith("/register") && pathname !== "/i") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return respond(NextResponse.redirect(loginUrl));
  }

  if (sessionToken && isAuthRoute) {
    return respond(NextResponse.redirect(new URL("/accueil", request.url)));
  }

  const isOnboardingRoute = ONBOARDING_ROUTES.some((route) => pathname.startsWith(route));
  if (sessionToken && !hasActiveHousehold && !isOnboardingRoute) {
    return respond(NextResponse.redirect(new URL("/integrations", request.url)));
  }

  return respond(NextResponse.next());
}

function safeParseMeta(meta: string) {
  try {
    return JSON.parse(meta) as { hasHousehold: boolean };
  } catch {
    return { hasHousehold: false };
  }
}

function ensureCsrfCookie(request: NextRequest, response: NextResponse) {
  if (!request.cookies.get(CSRF_COOKIE)?.value) {
    response.cookies.set(CSRF_COOKIE, globalThis.crypto.randomUUID().replace(/-/g, ""), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!api\\/public|_next/static|_next/image|favicon.ico|service-worker.js|manifest.json).*)"],
};
