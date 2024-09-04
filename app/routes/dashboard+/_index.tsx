import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { BigPlayButton, Player } from "video-react";
import { prisma } from '#app/utils/db.server'
import { siteConfig } from '#app/utils/constants/brand'
import { requireUser } from '#app/services/session.server.js';

export const meta: MetaFunction = () => {
  return [{ title: `${siteConfig.siteTitle} - Dashboard` }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)
  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  })
  return json({ user, subscription } as const)
}

export default function DashboardIndex() {
  // const { t } = useTranslation()

  return (
    <div className="flex h-full w-full bg-secondary px-6 py-8 dark:bg-black">
      <div className="z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12">
        <div className="flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black">
          <div className="flex w-full flex-col rounded-lg p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-medium text-primary">Get Started</h2>
              <p className="text-sm font-normal text-primary/60">
                Explore the Dashboard and get started with your first app.
              </p>
            </div>
          </div>
          <div className="flex w-full px-6">
            <div className="w-full border-b border-border" />
          </div>
          <div className="relative mx-auto flex w-full  flex-col items-center p-6">
            <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                {/* This gives a grid background */}
                <div className="base-grid absolute h-full w-full opacity-40" /> 
                {/* This give an overlay of fading the grid */}
                <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                <Player playsInline src="/media/test.mp4">
                  <BigPlayButton position="center" />
                </Player>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
