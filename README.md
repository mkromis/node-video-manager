# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Creation Steps

1. Read about target, for my situation it was `Qnap Container Station`
    1. Network binding via bridge works, address moves with restarts.
2. Create app with vite `pnpm create vite`
3. Select `React` -> `Remix`
4. [Dockerize pnpm](https://pnpm.io/docker)
    1. change dist locations to build
    2. `docker build -t video-manager .`
5. [Add Tailwind and Drizzle](https://dev.to/franciscomendes10866/building-dynamic-web-applications-with-remixjs-drizzle-orm-and-tailwind-540k)
    * Tailwind is already installed from `pnpm create vite`.
    * Add [DailyUI](https://daisyui.com/docs/install/) 
    * [DailyUI Playground](https://daisyui.com/tailwindplay/)
    * [Generate Routes](https://github.com/sandulat/routes-gen)
        * [Invalid Driver Issue](https://github.com/sandulat/routes-gen/issues/42)

## Development

Run the dev server:

```sh
pnpm dev
```

## Deployment

First, build your app for production:

```sh
pnpm run build
```

Then run the app in production mode:

```sh
pnpm run start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
