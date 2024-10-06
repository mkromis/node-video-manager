// Refer to https://github.com/sergiodxa/remix-auth-github for more information
import { GitHubStrategy } from "remix-auth-github";
import { prisma } from "~/utils/db.server.js";
import { ERRORS } from "~/utils/constants/errors.js";
import { HOST_URL } from "~/utils/misc.server.js";
import { type User } from "@prisma/client";

const clientID = process.env.GITHUB_CLIENT_ID || '1';
const clientSecret = process.env.GITHUB_CLIENT_SECRET || '2';

if (!clientID || !clientSecret) {
  throw new Error("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET");
}

/**
 * Github - Strategy.
 */
export const githubStrategy = new GitHubStrategy<User>(
  {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    redirectURI: `${HOST_URL}/auth/github/callback`,
  },
  async ({ profile }) => {
    const email = profile._json.email || profile.emails[0].value
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        image: { select: { id: true } },
        roles: { select: { name: true } },
      },
    })

    if (!user) {
      // user = await prisma.user.create({
      //   data: {
      //     roles: { connect: [{ name: 'user' }] },
      //     email,
      //   },
      //   include: {
      //     image: { select: { id: true } },
      //     roles: {
      //       select: {
      //         name: true,
      //       },
      //     },
      //   },
      // })
      if (!user) throw new Error(ERRORS.AUTH_USER_NOT_CREATED)
    }

    return user
  },
)
