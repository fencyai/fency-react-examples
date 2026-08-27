import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/streaming-chat-completion(.*)',
  '/structured-chat-completion(.*)',
  '/explore-memories(.*)',
  '/document-analysis(.*)',
])

const isFencyWebhook = createRouteMatcher([
  '/document-analysis/api/fency-webhook',
])

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req) && !isFencyWebhook(req)) {
      await auth.protect()
    }
  },
  {
    authorizedParties: [
      'https://react.fency.ai',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
    ],
  },
)

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
