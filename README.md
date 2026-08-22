# Fency React Examples

Node.js 20+. You need a [Fency](https://app.fency.ai) publishable key and secret
key. Allow origin `http://localhost:3000` on the publishable key.

Authentication is [Clerk](https://clerk.com). `clerk init` provisions a
claimable development app and writes the Clerk keys into `.env.local`.

```bash
cp .env.example .env.local
```

Set the Fency keys in `.env.local`:

```
FENCY_SECRET_KEY=sk_...
NEXT_PUBLIC_FENCY_PUBLISHABLE_KEY=pk_...
DATABASE_URL=postgresql://fency:fency@127.0.0.1:5433/fency_react_examples
EXPLORE_MEMORIES_VERSION_TAG=explore_memories_local_v1
```

Explore Memories versions its DemoCar catalog with
`EXPLORE_MEMORIES_VERSION_TAG`. Changing that value isolates a new dataset in
Fency; the setup gate will ask you to seed again. Use a different tag in
production (`explore_memories_prod_v1`) so local and prod do not share
memories.

Explore Memories stores the DemoCar catalog in Postgres, then writes each
row's Fency `memoryId` after sync. Start Postgres and apply migrations:

```bash
docker compose up -d
npm run db:migrate
```

`db:push` remains a local shortcut. After schema changes, generate a
migration with `npm run db:generate`.

After setting `DATABASE_URL` on Vercel, apply the same migrations to the
prod Neon database (reads the URL from 1Password):

```bash
./run-neon-migrations-prod.sh
```

If Clerk keys are missing, run:

```bash
npx -y clerk@latest init --keyless -y
```

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up from the header,
then open an example. The landing page is public; the three examples require
sign-in.

In the [Clerk dashboard](https://dashboard.clerk.com), enable **Email**,
**Password**, and **Google** as sign-in methods.

Production at [react.fency.ai](https://react.fency.ai) uses the `fency.ai`
Clerk instance. The Frontend API CNAMEs (`clerk`, `accounts`, `clkmail`,
`clk._domainkey`, `clk2._domainkey`) live in `fency-infra`'s
`DotAiDnsRecordsStack`. On Vercel production, set
`CLERK_DISABLE_AUTO_PROXY=true` so the build loads clerk-js from
`clerk.fency.ai` instead of `/__clerk`. Production Google OAuth credentials
must be configured on the Clerk production instance; development shared
credentials do not carry over.
