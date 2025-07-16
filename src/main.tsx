import { loadFency } from '@fencyai/js'
import { FencyProvider } from '@fencyai/react'
import { MantineProvider } from '@mantine/core'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'

import {
    CodeHighlightAdapterProvider,
    createShikiAdapter,
} from '@mantine/code-highlight'

import '@mantine/code-highlight/styles.css'
import '@mantine/core/styles.css'

// Shiki requires async code to load the highlighter
async function loadShiki() {
    const { createHighlighter } = await import('shiki')
    const shiki = await createHighlighter({
        langs: ['tsx', 'json'],
        themes: [],
    })

    return shiki
}
const shikiAdapter = createShikiAdapter(loadShiki)

const fency = loadFency({
    // Replace with publishable key from your account inside .env.local
    publishableKey: import.meta.env.VITE_FENCY_PUBLISHABLE_KEY,
    // Our team is setting this variable when running a local instance of the Fency API during development, you don't have to set it
    baseUrl: import.meta.env.VITE_FENCY_BASE_URL,
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <MantineProvider>
                <FencyProvider fency={fency}>
                    <CodeHighlightAdapterProvider adapter={shikiAdapter}>
                        <App />
                    </CodeHighlightAdapterProvider>
                </FencyProvider>
            </MantineProvider>
        </BrowserRouter>
    </StrictMode>
)
