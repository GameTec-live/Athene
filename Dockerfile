# syntax=docker/dockerfile:1
ARG BUN_VERSION=1.4.2
FROM oven/bun:${BUN_VERSION}-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
ENV NITRO_PRESET=bun
RUN bun --bun run build

FROM oven/bun:${BUN_VERSION}-alpine AS production-deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

FROM oven/bun:${BUN_VERSION}-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
COPY --from=build --chown=bun:bun /app/.output ./.output
COPY --from=build --chown=bun:bun /app/drizzle ./drizzle
COPY --from=production-deps --chown=bun:bun /app/node_modules ./node_modules
COPY --from=build --chown=bun:bun /app/package.json /app/tsconfig.json /app/drizzle.config.ts ./
COPY --from=build --chown=bun:bun /app/src/env.ts ./src/env.ts
USER bun
EXPOSE 3000
ENTRYPOINT ["sh", "-c", "bun --bun run db:migrate && exec bun .output/server/index.mjs"]
