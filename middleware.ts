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

  // Define route categories
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/consent',
    '/terms',
    '/privacy',
  ]

  const welcomeRoute = '/welcome'

  const authOnlyRoutes = ['/login', '/signup']

  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/searcher',
    '/owner',
    '/resident',
  ]

  // OAuth callback - always allow
  if (pathname.startsWith('/auth/callback')) {
    return response
  }

  // Allow access to public API routes
  if (pathname.startsWith('/api/')) {
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
