// Small shared shape every function handler uses: parse the bearer token,
// run the handler, and turn AuthError/NotFound/Forbidden into the right
// status code — so no individual function re-implements the auth boilerplate
// or the error-to-status mapping.
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { AuthError, verifyBearerToken, type AuthenticatedUser } from './auth.js'

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export const notFound = (what: string) => new HttpError(404, `${what} not found.`)
export const forbidden = (what: string) => new HttpError(403, `You don't have access to ${what}.`)
export const badRequest = (message: string) => new HttpError(400, message)

function authConfig(): { tenantId: string; audience: string } {
  const tenantId = process.env['ENTRA_TENANT_ID']
  const audience = process.env['ENTRA_API_AUDIENCE']
  if (!tenantId || !audience) {
    throw new Error('ENTRA_TENANT_ID / ENTRA_API_AUDIENCE are not set — see local.settings.json.example.')
  }
  return { tenantId, audience }
}

type Handler = (
  req: HttpRequest,
  user: AuthenticatedUser,
  context: InvocationContext,
) => Promise<HttpResponseInit>

/** Wraps a handler with bearer-token verification and uniform error mapping. */
export function withAuth(handler: Handler) {
  return async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const user = await verifyBearerToken(req.headers.get('authorization'), authConfig())
      return await handler(req, user, context)
    } catch (err) {
      if (err instanceof AuthError) return { status: 401, jsonBody: { error: err.message } }
      if (err instanceof HttpError) return { status: err.status, jsonBody: { error: err.message } }
      context.error('Unhandled error', err)
      return { status: 500, jsonBody: { error: 'Internal error.' } }
    }
  }
}

export const json = (status: number, body: unknown): HttpResponseInit => ({ status, jsonBody: body })
