import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// These paths are always accessible without auth
const PUBLIC_PATHS = ['/setup', '/login']
// Cookie names (must match what setup/login pages write)
const SETUP_COOKIE = 'gg_setup_complete'
const AUTH_COOKIE = 'gg_token'
// Internal URL to reach the API container (server-side only)
const INTERNAL_API = process.env.INTERNAL_API_URL || 'http://api:8000'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow Next.js internals and public auth pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/') ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
  ) {
    return NextResponse.next()
  }

  // ── First-run setup check ────────────────────────────────────────────────
  // Fast path: cookie is set after setup completes, skip the API call
  const setupDone = request.cookies.get(SETUP_COOKIE)?.value === 'true'

  if (!setupDone) {
    try {
      const res = await fetch(`${INTERNAL_API}/setup/status`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.setup_required) {
          return NextResponse.redirect(new URL('/setup', request.url))
        }
      }
    } catch {
      // Backend not reachable yet — let the request through so the app can
      // render an appropriate error state rather than looping on /setup.
    }
  }

  // ── Auth check ───────────────────────────────────────────────────────────
  const token = request.cookies.get(AUTH_COOKIE)?.value
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
