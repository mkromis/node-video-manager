import type { ActionFunctionArgs } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from '@remix-run/node'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import { authenticator } from '#app/services/auth.server.js'

export const ROUTE_PATH = '/auth/:provider' as const

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return redirect(LOGIN_PATH)
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (typeof params.provider !== 'string') throw new Error('Invalid provider.')
  return authenticator.authenticate(params.provider, request)
}
