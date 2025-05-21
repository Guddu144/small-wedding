import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
const isAuthRoute = createRouteMatcher(['/login(.*)', '/get-started(.*)'])

export default clerkMiddleware(
  async (auth, req) => {
    const { userId } = await auth()

    // Protect dashboard routes
    if (isProtectedRoute(req)) {
      await auth.protect()
    }

    // Redirect authenticated users away from auth pages 
    if (isAuthRoute(req) && userId) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    signInUrl: '/login'
  }
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}