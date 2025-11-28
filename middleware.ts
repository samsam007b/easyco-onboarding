import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware for route protection and authentication
 * Runs on every request to check auth status and handle redirects
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { user }, error } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Handle route redirects for standardization
  const routeRedirects: Record<string, string> = {
    '/properties/new': '/properties/add',
    '/groups/new': '/dashboard/searcher/groups/create',
    '/groups/create': '/dashboard/searcher/groups/create',
    '/auth/signup': '/auth?mode=signup',
    '/auth/login': '/auth',
    '/login': '/auth',
    '/signup': '/auth?mode=signup',
    '/properties': '/dashboard/searcher',
    '/properties/browse': '/dashboard/searcher',
    '/matching/matches': '/dashboard/searcher/groups',
    '/dashboard/searcher/top-matches': '/dashboard/searcher/groups',
  }

  // Check if current path needs redirection
  if (routeRedirects[pathname]) {
    return NextResponse.redirect(new URL(routeRedirects[pathname], request.url))
  }

  // Define route categories
  const publicRoutes = [
    '/',
    '/auth',
    '/forgot-password',
    '/reset-password',
    '/terms',
    '/privacy',
    '/legal',
  ]

  // Guest-limited routes (accessible without auth but with limitations)
  const guestLimitedRoutes = [
    '/properties/', // Property detail pages (guest mode)
  ]

  const welcomeRoute = '/welcome'

  const authOnlyRoutes = ['/auth']

  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/searcher',
    '/owner',
    '/resident',
    '/matching',
    '/properties',
    '/messages',
  ]

  // OAuth callback - always allow
  if (pathname.startsWith('/auth/callback')) {
    return response
  }

  // Define public API routes that don't require authentication
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/callback',
    '/api/health', // if you have health check endpoints
  ]

  // Define protected API routes that require authentication
  const protectedApiRoutes = [
    '/api/user/',
    '/api/analytics',
    '/api/admin/',
  ]

  // Check if this is an API route
  if (pathname.startsWith('/api/')) {
    // Allow public API routes without authentication
    const isPublicApi = publicApiRoutes.some(route => pathname.startsWith(route))
    if (isPublicApi) {
      return response
    }

    // Check if this is a protected API route
    const isProtectedApi = protectedApiRoutes.some(route => pathname.startsWith(route))
    if (isProtectedApi && !user) {
      // Return 401 for protected API routes without authentication
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    }

    // For other API routes, allow with warning (log for monitoring)
    console.warn(`[MIDDLEWARE] Unclassified API route accessed: ${pathname}`)
    return response
  }

  // Allow access to static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return response
  }

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  // Check if current route is guest-limited (accessible but with restrictions)
  const isGuestLimitedRoute = guestLimitedRoutes.some(route => pathname.startsWith(route))

  // Check if current route is auth-only (login/signup)
  const isAuthOnlyRoute = authOnlyRoutes.some(route => pathname === route || pathname.startsWith(route))

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route))

  // Handle authenticated users trying to access auth-only routes
  if (user && isAuthOnlyRoute) {
    // Get user data to determine redirect
    const { data: userData } = await supabase
      .from('users')
      .select('user_type, onboarding_completed')
      .eq('id', user.id)
      .single()

    if (userData) {
      // If onboarding not completed, redirect to onboarding
      // BUT only if not already on an onboarding page (prevent loops)
      if (!userData.onboarding_completed && !pathname.startsWith('/onboarding')) {
        return NextResponse.redirect(
          new URL(`/onboarding/${userData.user_type}/basic-info`, request.url)
        )
      }

      // If onboarding completed and user has a role, redirect to their dashboard
      if (userData.onboarding_completed && userData.user_type) {
        return NextResponse.redirect(new URL(`/dashboard/${userData.user_type}`, request.url))
      }

      // If onboarding completed but no role yet (edge case), go to welcome for role selection
      if (userData.onboarding_completed && !userData.user_type) {
        return NextResponse.redirect(new URL(welcomeRoute, request.url))
      }
    }

    // Fallback: If user exists but no userData found, redirect to welcome
    return NextResponse.redirect(new URL(welcomeRoute, request.url))
  }

  // Handle guest-limited routes (allow access but add guest mode header)
  if (isGuestLimitedRoute && !user) {
    // Allow access but mark as guest mode
    const guestResponse = NextResponse.next()
    guestResponse.headers.set('X-Guest-Mode', 'true')
    guestResponse.headers.set('X-Guest-Limit', '20') // Limit results for guests
    return guestResponse
  }

  // Handle unauthenticated users trying to access protected routes
  if (!user && isProtectedRoute) {
    // Save intended destination for redirect after login
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Allow onboarding routes for authenticated users
  if (pathname.startsWith('/onboarding')) {
    if (!user) {
      // Unauthenticated users should not access onboarding
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Allow authenticated users to access onboarding
    return response
  }

  // Allow welcome route for authenticated users only
  if (pathname === welcomeRoute) {
    if (!user) {
      // Unauthenticated users should not access welcome page
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Allow authenticated users to access welcome page
    return response
  }

  // For all other cases, allow the request
  return response
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
