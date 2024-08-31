// Refer to https://github.com/dev-xo/remix-auth-totp for more information
import { TOTPStrategy } from "remix-auth-totp";
import { sendAuthEmail } from "~/modules/email/templates/auth-email.js";
import { prisma } from "~/utils/db.server.js";
import { ERRORS } from "~/utils/constants/errors.js";
import { ROUTE_PATH as MAGIC_LINK_PATH } from '~/routes/auth+/magic-link'
import { type User } from "@prisma/client";

export const totpStrategy = new TOTPStrategy<User>(
    {
      secret: process.env.ENCRYPTION_SECRET || 'NOT_A_STRONG_SECRET',
      magicLinkPath: MAGIC_LINK_PATH,
      sendTOTP: async ({ email, code, magicLink }) => {
        if (process.env.NODE_ENV === 'development') {
          // Development Only: Log the TOTP code.
          console.log('[ Dev-Only ] TOTP Code:', code)

          // Email is not sent for admin users.
          if (email.startsWith('admin')) {
            console.log('Not sending email for admin user.')
            return
          }
        }
        await sendAuthEmail({ email, code, magicLink })
      },
    },
    async ({ email }) => {
      let user = await prisma.user.findUnique({
        where: { email },
        include: {
          image: { select: { id: true } },
          roles: { select: { name: true } },
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            roles: { connect: [{ name: 'user' }] },
            email,
          },
          include: {
            image: { select: { id: true } },
            roles: {
              select: {
                name: true,
              },
            },
          },
        })
        if (!user) throw new Error(ERRORS.AUTH_USER_NOT_CREATED)
      }

      return user
    },
  )