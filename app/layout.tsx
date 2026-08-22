import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fency Integration Examples',
  description:
    'End-to-end Next.js examples for the Fency public API and published SDKs.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <header className="border-b border-(--border) bg-(--card)">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3 text-sm">
            <Link href="/" className="font-semibold">
              Fency examples
            </Link>
            <Link
              href="/streaming-chat-completion"
              className="text-(--muted) hover:text-(--foreground)"
            >
              Streaming chat
            </Link>
            <Link
              href="/structured-chat-completion"
              className="text-(--muted) hover:text-(--foreground)"
            >
              Structured chat
            </Link>
          </nav>
        </header>
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </body>
    </html>
  )
}
