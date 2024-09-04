import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { authenticator } from "./auth.server";
import { prisma } from "#app/utils/db.server.js";
import { ROUTE_PATH as LOGOUT_PATH } from '~/routes/auth+/logout'

// was in remix-saas sample
// export const AUTH_SESSION_KEY = '_auth'

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "vidman_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.SESSION_SECRET || 'NOT_A_STRONG_SECRET'], // replace this with an actual secret
    secure: false, // TODO: Disabled for nas useage, enable if yyou have a cert.
      //process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage;

/**
 * Helpers.
 */
export async function requireSessionUser(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const sessionUser = await authenticator.isAuthenticated(request)
  if (!sessionUser) {
    if (!redirectTo) throw redirect(LOGOUT_PATH)
    else throw redirect(redirectTo)
  }
  return sessionUser
}

export async function requireUser(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const sessionUser = await authenticator.isAuthenticated(request)
  const user = sessionUser?.id
    ? await prisma.user.findUnique({
        where: { id: sessionUser?.id },
        include: {
          image: { select: { id: true } },
          roles: { select: { name: true } },
        },
      })
    : null
  if (!user) {
    if (!redirectTo) throw redirect(LOGOUT_PATH)
    else throw redirect(redirectTo)
  }
  return user
}
