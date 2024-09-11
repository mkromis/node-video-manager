// Refer to https://github.com/sergiodxa/remix-auth-form for more information
import { ERRORS } from "#app/utils/constants/errors.js";
import { prisma } from "#app/utils/db.server.js";
import { type User } from "@prisma/client";
import { FormStrategy } from "remix-auth-form";
import * as argon2 from 'argon2'

export const formStrategy = new FormStrategy<User>(
  async ({ form, context }) => {
    // Get form data
    const email = (form.get("email")?? '').toString();
    const pass = (form.get("passwd")?? '').toString();

    // check for valid data
    if (email.length === 0 || pass.length === 0)
      throw new Error(ERRORS.AUTH_SOMETHING_WENT_WRONG);

    // User lookup
    let user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        image: { select: { id: true } },
        roles: { select: { name: true } },
      },
    })

    // Invalid user
    if (!user) throw new Error(ERRORS.AUTH_SOMETHING_WENT_WRONG);

    const isPasswordValid = await argon2.verify(user.passhash, pass)
    if (!isPasswordValid) throw new Error(ERRORS.AUTH_SOMETHING_WENT_WRONG);

    // Maybe?
    // if (!user) {
    //   user = await prisma.user.create({
    //     data: {
    //       roles: { connect: [{ name: 'user' }] },
    //       email,
    //     },
    //     include: {
    //       image: { select: { id: true } },
    //       roles: {
    //         select: {
    //           name: true,
    //         },
    //       },
    //     },
    //   })

    return user
  }
);
