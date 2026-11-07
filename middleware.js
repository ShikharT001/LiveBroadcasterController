import { updateSession } from './lib/supabase/middleware';

export async function middleware(request) {
  // Overlays and static assets do not require auth middleware interception
  if (
    request.nextUrl.pathname.startsWith('/overlay') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return;
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
