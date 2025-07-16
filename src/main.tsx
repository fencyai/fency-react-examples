import { loadFency } from '@fencyai/js'
import { FencyProvider } from '@fencyai/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.css'

// Replace with publishable key from your account inside .env.local
const fency = loadFency(import.meta.env.VITE_FENCY_PUBLISHABLE_KEY)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <FencyProvider fency={fency}>
                <App />
            </FencyProvider>
        </BrowserRouter>
    </StrictMode>
)
