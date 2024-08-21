# base node image
FROM node:20-slim as base

# set for base and all layer that inherit from it

# setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /remixapp
WORKDIR /remixapp

# Install all node_modules, including dev
FROM base as deps

WORKDIR /remixapp

ADD package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Setup production node_modules
FROM base as production-deps

WORKDIR /remixapp

COPY --from=deps /remixapp/node_modules /remixapp/node_modules
ADD package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build the app
FROM base as build

WORKDIR /remixapp

#RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=deps /remixapp/node_modules /remixapp/node_modules
ADD package.json pnpm-lock.yaml postcss.config.js tailwind.config.cjs tsconfig.json vite.config.ts ./
ADD app/ app/
ADD public/ public/

RUN pnpm run build

# Finally, build the production image with minimal footprint
FROM base

# You may need to run volumes from command instead from UI
RUN mkdir /data
WORKDIR /remixapp

ENV NODE_ENV production
ENV SESSION_SECRET ThisIsAS4cr3tKey
ENV DB_PATH /data
ENV MEDIA /media
ENV PORT 80

COPY --from=production-deps /remixapp/node_modules /remixapp/node_modules
COPY --from=build /remixapp/build /remixapp/build
COPY --from=build /remixapp/package.json /remixapp/package.json

ADD server.js ./
ADD migrations/ migrations/

#RUN mkdir /remixapp/data

CMD ["npm", "start"]
