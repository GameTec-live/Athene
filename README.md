# Athene

A selfhosted classroom solution for ForgeJo

## Container deployment

The image runs the Nitro production server with Bun as an unprivileged user.
It contains only the production output; configuration and secrets are supplied
at runtime. Builds never need a database, Forgejo credentials, or a `.env` file.

1. Copy `.env.example` to `.env` and fill in your Forgejo OAuth credentials,
   API token, database password, and a random Better Auth secret (at least 32
   characters). Use only letters, digits, hyphens, and underscores in the
   database password, since Compose inserts it into a connection URL.
   Register the OAuth callback as
   `<BETTER_AUTH_URL>/api/auth/oauth2/callback/forgejo` in Forgejo.
2. Run `docker compose up -d db`, then initialize the PostgreSQL schema with
   `bun install --frozen-lockfile` and `bun run db:migrate` from the checkout.
   Keep `DATABASE_URL` in `.env` in sync with `POSTGRES_PASSWORD`.
   PostgreSQL is exposed only on host loopback port 5432 for migrations.
   Migrations are a separate deployment step; the app
   image does not apply them automatically.
3. Run `docker compose up -d`. The root `compose.yaml` provides Athene on port
   3000 and PostgreSQL with persistent storage. For public deployments, set
   `BETTER_AUTH_URL` to the public URL and put the app behind an HTTPS proxy.

To build locally instead of pulling GHCR:

```sh
docker build -t athene:local .
ATHENE_IMAGE=athene:local docker compose up -d --pull never
```

## CI and trying PR images

Every PR and push to `main` runs `biome ci` and TypeScript checks with Bun,
then builds Linux amd64 and arm64 images on native runners. Each build uploads
an `athene-amd64` or `athene-arm64` artifact, retained for seven days.

Download and unzip the artifact matching your machine from the workflow run,
then load it and select its tag in Compose. For example, for PR 42 on amd64:

```sh
docker load --input athene-amd64.tar
ATHENE_IMAGE=ghcr.io/gametec-live/athene:pr-42-amd64 docker compose up -d --pull never
```

Use `pr-42-arm64` and `athene-arm64.tar` for arm64. PR images are distributed
as archives, without publishing to the registry. The tag refers to the PR's
tested merge with its base branch.

Successful pushes to `main` additionally publish
`ghcr.io/gametec-live/athene:latest` and `:sha-<full-commit-sha>`, each containing
both architectures. Main's archives use `:sha-<full-commit-sha>-amd64` and
`:sha-<full-commit-sha>-arm64`. Registry authentication uses the workflow's
`GITHUB_TOKEN` with package write permission; no extra registry secret is needed.
