# Fency React Examples

End-to-end Next.js examples for the [Fency](https://fency.ai) public API and
published SDKs (`@fencyai/js`, `@fencyai/react`). Each example is a
self-contained folder that maps 1-to-1 to a guide in the
[Integration](https://fency.ai/docs/integration) section of the docs.

| Example | Route | Guide |
|---|---|---|
| Streaming chat completion | [`/streaming-chat-completion`](./app/streaming-chat-completion) | [Guide](https://fency.ai/docs/integration/streaming-chat-completion) |
| Structured chat completion | [`/structured-chat-completion`](./app/structured-chat-completion) | [Guide](https://fency.ai/docs/integration/structured-chat-completion) |

## Prerequisites

- Node.js 20+
- Docker (for local Postgres)
- A [Fency](https://app.fency.ai) account with a publishable key (`pk_...`) and a
  secret key (`sk_...`)
- On the publishable key, allow origin `http://localhost:3000`

## Local setup

```bash
docker compose up -d
cp .env.example .env.local
```

Edit `.env.local` and replace the key placeholders:

```
FENCY_SECRET_KEY=sk_...
NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY=pk_...
DATABASE_URL=postgresql://fency_examples:fency_examples@127.0.0.1:10120/fency_examples
```

```bash
npm install
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `FENCY_SECRET_KEY` | Server | Bearer token for `POST /v1/sessions` and `POST /v1/conversations` |
| `NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY` | Client | Passed to `loadFency` |
| `DATABASE_URL` | Server | Postgres connection string |

The Fency API base URL is always `https://api.fency.ai`. There is no env var
for it.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Generate Drizzle migrations from the example schemas |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Drizzle Studio |

## How the repo is organized

This is one Next.js app so it can deploy as one Vercel project. Code for each
example does not overlap. Read [AGENTS.md](./AGENTS.md) before changing
structure.

## Production

Deploy the app to Vercel. Point `DATABASE_URL` at a hosted Postgres instance
(Neon, Supabase, or similar) and set the two Fency keys in the project
environment. Add your Vercel origin to the publishable key's allowed origins.
