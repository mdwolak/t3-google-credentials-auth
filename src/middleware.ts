import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse, userAgent } from "next/server";

//Limit the middleware to the following paths
export const config = {
  matcher: "/admin/:path*",
};

export async function middleware(req: NextRequest) {
  const { isBot } = userAgent(req);
  if (isBot) {
    return NextResponse.next({ status: 400 });
  }

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req });
    console.log(token);
    if (!token) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", encodeURI(req.url));
      return NextResponse.redirect(url);
    }
    // if (token.role !== "ADMIN") {
    //   const url = new URL("/403", req.url);
    //   return NextResponse.rewrite(url, { status: 403 });
    // }
  }
  return NextResponse.next();
}
