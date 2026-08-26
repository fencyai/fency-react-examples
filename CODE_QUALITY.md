# Code quality bar

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
