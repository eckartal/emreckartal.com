import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

let initialDate = Date.now();

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add X-Robots-Tag header for better SEO
  response.headers.set('X-Robots-Tag', 'index, follow');
  
  // Set content security policy if needed
  // response.headers.set('Content-Security-Policy', "default-src 'self';");
  
  response.headers.set("x-edge-age", String(Date.now() - initialDate));
  
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
