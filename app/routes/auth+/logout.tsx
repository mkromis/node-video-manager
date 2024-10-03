import { authenticator } from '#app/services/auth.server.js'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'

export const ROUTE_PATH = '/auth/logout' as const

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return authenticator.logout(request, { redirectTo: '/' })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  return authenticator.logout(request, { redirectTo: '/' })
}
