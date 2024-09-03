// Refer to https://github.com/sergiodxa/remix-auth-form for more information
import { ERRORS } from "#app/utils/constants/errors.js";
import { prisma } from "#app/utils/db.server.js";
import { type User } from "@prisma/client";
import { FormStrategy } from "remix-auth-form";

export const formStrategy = new FormStrategy<User>(
  async ({ form, context }) => {
    const email = form.get("email")?.toString();
    if (email == null)
      throw new Error(ERRORS.AUTH_SOMETHING_WENT_WRONG);

    let user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        image: { select: { id: true } },
        roles: { select: { name: true } },
      },
    })

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
      if (!user) throw new Error(ERRORS.AUTH_SOMETHING_WENT_WRONG)

    return user
  }
);
