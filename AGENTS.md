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

## Code quality bar

This is a customer-facing public webapp. Customers read this code to learn the
Fency framework, so every file is documentation. The code needs special
attention to detail with regards to software architecture, clean code, and
well-known patterns.

- Prefer well-known, idiomatic React and Next.js patterns over clever or
  novel ones. A reader should recognize the shape of the code immediately.
- Use intention-revealing names and small, single-purpose functions and
  components. If a file needs a comment to explain what it does, first try
  renaming or splitting it.
- Keep examples free of dead code, debug leftovers, and speculative
  abstractions. Ship only what the matching guide teaches.
- Readability and pragmatism beat defensive programming. The examples are
  happy-path code: make the documented flow work and read cleanly, and do not
  bury it under edge-case handling, retries, or exhaustive validation. On an
  unknown edge case, just throw. A short `throw new Error(...)` is better for
  the reader than branching that obscures the Fency integration being taught.
- Keep the file structure intuitive and files lean. A file name should match
  the class, function, or component it exports (`Chat.tsx` exports `Chat`,
  `useStreamingChat.ts` exports `useStreamingChat`). Split a file when it
  accumulates unrelated responsibilities, and delete folders that hold
  nothing.
- Code must be self-explanatory. It should read cleanly without excessive
  commenting to explain complexity. If a section needs a comment to be
  understood, restructure or rename until it does not.
- Prefer a Zod schema over a TypeScript `as` cast when reading unknown data
  such as JSON bodies and fetch responses. Use `schema.parse(...)` so a bad
  shape throws; do not cast the result.

## Package by feature, then by layer

The repo is organized package-by-feature first, package-by-layer second:

1. **Feature packages.** Each example folder under `app/` (for example
   `app/explore-memories/`) is one feature package. Everything the feature
   needs lives inside its folder; nothing leaks out (see the no-overlap
   contract below).
2. **Layer packages inside each feature.** Within a feature, group files by
   layer using these folder names:
   - `page.tsx` — the feature's entry point.
   - `components/` — UI layer, one React component per file.
   - `hooks/` — client-side state and orchestration layer.
   - `api/` — server layer: route handlers plus the Fency API calls they
     make. Route-specific helpers live next to their `route.ts`.
   - `db/` — persistence layer (`schema.ts`, `client.ts`, `queries.ts`,
     `migrations/`), only when the feature persists data.
3. **Dependencies point inward.** `components/` may use `hooks/`; `hooks/`
   call the feature's `api/` routes over HTTP; `api/` may use `db/`. Never
   the other way around, and never sideways into another feature.
4. **Add layers, not levels.** When a feature grows, add files to the
   correct layer folder instead of inventing new top-level folders or
   nesting layers inside layers.

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
    add a base-URL env var. The client omits `baseUrl` on `loadFency`. Each
    session route hardcodes the URL in its own `route.ts`.
12. **Session routes are standalone.** Do not extract a shared
    `createFencySession` helper. Duplicate the `POST /v1/sessions` call in
    each session `route.ts` so a reader can understand that session from one
    file.
13. **Name API routes by action.** Use a verb-first folder name that matches
    what the route does, for example `api/create-stream-session` and
    `api/create-agent-task-session`. Do not name a route after the resource
    noun alone.

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
   colocated standalone `api/` session routes. Import `getAuthorizedUserId`
   from `app/auth.ts`. Put `FencyProvider` in that example's `page.tsx`. Add a
   `hooks/` folder only when that example needs hooks. Add `db/schema.ts`,
   `db/client.ts`, and `db/queries.ts` only if the example persists memory
   types or memories.
2. If it persists, prefix every table name with the slug and add a Drizzle
   config when that example is introduced.
3. Add a card on `app/page.tsx` and a link in `app/AppHeader.tsx`. Protect the
   new route tree in `proxy.ts`.
4. Add a row to the mapping table in this file.
5. Add a matching guide page and sidebar entry in
   `fency-docs-v2/content/docs/integration/`.
