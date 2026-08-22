# Fency React Examples

This repository is a single Next.js app that deploys to Vercel. Each example
is a self-contained folder under `app/` and maps 1-to-1 to one integration
guide in `fency-docs-v2`. Readers follow a guide while inspecting the matching
folder. That is why the examples must not share code.

## Example to guide mapping

| Example folder | Guide |
|---|---|
| `app/streaming-chat-completion/` | `/docs/integration/streaming-chat-completion` |
| `app/structured-chat-completion/` | `/docs/integration/structured-chat-completion` |

The guides live in `customers/fency-docs-v2/content/docs/integration/` in the
Fency workspace (published as the Integration section of the docs site).

## No-overlap contract

These rules are the point of the repo. Do not "clean them up."

1. **One folder, one example, one guide.** Every top-level folder under `app/`
   (other than the shell files listed below) is exactly one example.
2. **No imports across examples.** An example must never import from another
   example folder.
3. **No shared `lib/`.** There is no shared application library. Duplication
   between examples is intentional and required so a reader can stay inside one
   folder.
4. **Each example owns its database schema.** Table names are prefixed with the
   example slug (`streaming_...`, `structured_...`). Each example has its own
   `db/client.ts` (its own `pg.Pool` + Drizzle instance) and `db/queries.ts`.
5. **Relative imports only inside an example.** Do not add path aliases that
   reach into other examples.
6. **Published SDKs only.** Depend on `@fencyai/js` and `@fencyai/react` from
   npm. Never use `file:` links or `transpilePackages` for local SDK copies.
7. **Fency API base URL is constant.** Always `https://api.fency.ai`. Do not
   add a base-URL env var. The client omits `baseUrl` on `loadFency`. The
   server hardcodes the URL in that example's `fency.ts`.

## Root shell (out of scope for every guide)

These files are navigation chrome only. They contain no Fency code and must
stay that way:

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`

## Generated, not authored

- `drizzle/` - drizzle-kit writes migrations here because it needs a single
  output folder. Do not hand-edit these files. After changing an example
  schema, run `npm run db:generate`.

## Adding an example

1. Create `app/<example-slug>/` with its own page, provider, UI, `fency.ts`,
   `db/schema.ts`, `db/client.ts`, `db/queries.ts`, and colocated `api/` routes.
2. Prefix every table name with the slug.
3. Add the schema path to `drizzle.config.ts` and run `npm run db:generate`.
4. Add a card on `app/page.tsx` and a link in `app/layout.tsx`.
5. Add a row to the mapping table in this file.
6. Add a matching guide page and sidebar entry in
   `fency-docs-v2/content/docs/integration/`.
