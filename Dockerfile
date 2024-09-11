# base node image
FROM node:20-slim as base

# set for base and all layer that inherit from it

# setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install all node_modules, including dev
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq
RUN apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

WORKDIR /remixapp

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build application
COPY . /remixapp
RUN pnpm run build

# Generate Prisma Client
RUN pnpm run db:gen
COPY prisma ./prisma

# Setup production node_modules
FROM base as prod

WORKDIR /remixapp

# using from deps you need to specify full path
# COPY --from=deps /remixapp/node_modules /node_modules
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build the app
FROM base as deploy

# Install packages needed for deployment
RUN apt-get update -qq
RUN apt-get install --no-install-recommends -y openssl sqlite3
RUN rm -rf /var/lib/apt/lists /var/cache/apt/archives

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

RUN mkdir /data
WORKDIR /remixapp

# Copy files needed for deploy
COPY server.mjs docker-entrypoint.js package.json pnpm-lock.yaml postcss.config.mjs tailwind.config.ts tsconfig.json vite.config.ts ./

# Copy packages 
COPY --from=build /remixapp/node_modules /remixapp/node_modules

# Copy built application
COPY --from=build /remixapp/app /remixapp/app
COPY --from=build /remixapp/build /remixapp/build
COPY --from=build /remixapp/prisma /remixapp/prisma

# Entrypoint prepares the database.
ENTRYPOINT [ "/remixapp/docker-entrypoint.js" ]

ENV DATABASE_URL="file:///data/database.db?connection_limit=1"
ENV NODE_ENV production
ENV SESSION_SECRET ThisIsAS4cr3tKey
ENV DB_PATH /data
ENV MEDIA /media
ENV PORT 8080
ENV RESEND_API_KEY 1
ENV STRIPE_PUBLIC_KEY 1
ENV STRIPE_SECRET_KEY 1

CMD ["pnpm", "run", "start"]
