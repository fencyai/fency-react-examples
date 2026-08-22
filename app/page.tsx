import Link from 'next/link'

const examples = [
  {
    href: '/streaming-chat-completion',
    title: 'Streaming chat completion',
    description:
      'A persisted chat that streams tokens as they are generated and rehydrates the transcript from Postgres.',
    guide: 'https://fency.ai/docs/integration/streaming-chat-completion',
  },
  {
    href: '/structured-chat-completion',
    title: 'Structured chat completion',
    description:
      'Paste free text and extract a JSON record shaped by a Zod schema. Prior extractions are stored in Postgres.',
    guide: 'https://fency.ai/docs/integration/structured-chat-completion',
  },
]

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        Fency React examples
      </h1>
      <p className="mt-2 max-w-2xl text-(--muted)">
        Each example is a self-contained folder that maps 1-to-1 to a guide.
        Open the example, then follow the matching guide while inspecting that
        folder.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {examples.map((example) => (
          <li
            key={example.href}
            className="rounded-xl border border-(--border) bg-(--card) p-5"
          >
            <h2 className="font-semibold">{example.title}</h2>
            <p className="mt-2 text-sm text-(--muted)">{example.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href={example.href} className="underline underline-offset-4">
                Open example
              </Link>
              <a
                href={example.guide}
                className="text-(--muted) underline underline-offset-4"
              >
                Read the guide
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
