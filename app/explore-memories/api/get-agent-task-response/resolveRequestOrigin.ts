export function resolveRequestOrigin(request: Request) {
  const origin = request.headers.get('origin')?.trim()
  if (origin) {
    return origin
  }

  const forwardedProto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim()
  const forwardedHost =
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ??
    request.headers.get('host')?.trim()

  if (forwardedHost) {
    return `${forwardedProto ?? 'http'}://${forwardedHost}`
  }

  return 'http://localhost:3000'
}
