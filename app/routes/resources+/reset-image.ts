import type { ActionFunctionArgs } from '@remix-run/router'
import { prisma } from '#app/utils/db.server.js'
import { requireUser } from '#app/services/session.server.js'

export const ROUTE_PATH = '/resources/reset-image' as const

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request)
  await prisma.userImage.deleteMany({ where: { userId: user.id } })
  return null
}
