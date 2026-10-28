# syntax=docker/dockerfile:1
ARG BUN_VERSION=1.4.2
FROM oven/bun:${BUN_VERSION}-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
ENV NITRO_PRESET=bun
RUN bun --bun run build \
    && bun build --target=bun ./src/db/migrate.ts --outfile .output/migrate.mjs

FROM oven/bun:${BUN_VERSION}-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
COPY --from=build --chown=bun:bun /app/.output ./.output
COPY --from=build --chown=bun:bun /app/drizzle ./drizzle
USER bun
EXPOSE 3000
ENTRYPOINT ["sh", "-c", "bun .output/migrate.mjs && exec bun .output/server/index.mjs"]
