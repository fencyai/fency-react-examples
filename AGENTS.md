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
| `app/explore-memories/` | `/docs/integration/explore-memories` |

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
   folder. Auth is the exception: Clerk session lookup lives in `app/auth.ts`
   and is shell code, not example code.
4. **Database only for memory types and memories.** Conversations and agent
   tasks are retrieved from Fency with metadata. Do not add Postgres until an
   example must persist `memoryTypeId`s or memories. If it does, give it its
   own prefixed schema and `db/` folder. Do not share a client.
5. **Clerk-backed user.** Routes that talk to Fency resolve the signed-in user
   with `getAuthorizedUserId()` from `app/auth.ts` and return 401 when there
   is no session. Stamp `metadata.userId` on created conversations and agent
   tasks. Do not expose a user picker in the UI.
6. **Authorize conversationId with getConversation.** Before creating a task
   on an existing conversation, load it with `GET /v1/conversations/{id}` and
   return 403 unless `metadata.userId` matches the signed-in Clerk user.
   Retrieve a user's conversations with `POST /v1/conversations/search`.
7. **One component per file.** Never define more than one React component in
   the same file. Put helpers like `RecordCard` or `Bubble` in their own
   files under that example's `components/` folder.
8. **Route-only helpers stay in that route folder.** A file used by a single
   `api/<route>/route.ts` lives next to it. Keep a helper at `api/` only when
   more than one route imports it.
9. **Relative imports only inside an example.** Do not add path aliases that
   reach into other examples.
10. **Published SDKs only.** Depend on `@fencyai/js` and `@fencyai/react` from
    npm. Never use `file:` links or `transpilePackages` for local SDK copies.
11. **Fency API base URL is constant.** Always `https://api.fency.ai`. Do not
    add a base-URL env var. The client omits `baseUrl` on `loadFency`. The
    server hardcodes the URL in that example's `api/createFencySession.ts`.

## Root shell (out of scope for every guide)

These files are navigation and auth chrome only. They contain no Fency code
and must stay that way:

- `app/layout.tsx`
- `app/AppHeader.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/auth.ts`
- `app/sign-in/`
- `app/sign-up/`
- `proxy.ts`

## Adding an example

1. Create `app/<example-slug>/` with its own page, `components/`, and
   colocated `api/` routes (`api/createFencySession.ts` plus session routes).
   Import `getAuthorizedUserId` from `app/auth.ts`. Put `FencyProvider` in that
   example's `page.tsx`. Add a `hooks/` folder only when that example needs
   hooks. Add `db/schema.ts`, `db/client.ts`, and `db/queries.ts` only if the
   example persists memory types or memories.
2. If it persists, prefix every table name with the slug and add a Drizzle
   config when that example is introduced.
3. Add a card on `app/page.tsx` and a link in `app/AppHeader.tsx`. Protect the
   new route tree in `proxy.ts`.
4. Add a row to the mapping table in this file.
5. Add a matching guide page and sidebar entry in
   `fency-docs-v2/content/docs/integration/`.
