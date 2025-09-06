import { loadFency } from '@fencyai/js'
import { FencyProvider } from '@fencyai/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'

const fency = loadFency({
    // Replace with publishable key from your account inside .env.local
    publishableKey: import.meta.env.VITE_FENCY_PUBLISHABLE_KEY,
    // Our team is setting this variable when running a local instance of the Fency API during development, you don't have to set it
    baseUrl: import.meta.env.VITE_FENCY_BASE_URL,
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <FencyProvider fency={fency}>
                <App />
            </FencyProvider>
        </BrowserRouter>
    </StrictMode>
)
