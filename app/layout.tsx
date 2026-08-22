import { ClerkProvider } from '@clerk/nextjs'
import '@mantine/core/styles.css'
import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from '@mantine/core'
import type { Metadata } from 'next'
import { AppHeader } from './AppHeader'
import './globals.css'

const theme = createTheme({
  defaultRadius: 'lg',
})

export const metadata: Metadata = {
  title: 'Fency React Examples',
  description:
    'End-to-end Next.js examples for the Fency public API and published SDKs.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className="flex h-dvh flex-col overflow-hidden antialiased">
        <ClerkProvider>
          <MantineProvider defaultColorScheme="auto" theme={theme}>
            <AppHeader />
            <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              {children}
            </main>
          </MantineProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
