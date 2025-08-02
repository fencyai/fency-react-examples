import { Route, Routes } from 'react-router'
import AnthropicStreamingChatCompletion from './pages/anthropic/AnthropicStreamingChatCompletion'
import AnthropicSynchronousChatCompletion from './pages/anthropic/AnthropicSynchronousChatCompletion'
import GeminiStreamingChatCompletion from './pages/gemini/GeminiStreamingChatCompletion'
import GeminiStructuredChatCompletion from './pages/gemini/GeminiStructuredChatCompletion'
import GeminiSynchronousChatCompletion from './pages/gemini/GeminiSynchronousChatCompletion'
import Home from './pages/Home'
import OpenaiStreamingChatCompletion from './pages/openai/OpenaiStreamingChatCompletion'
import OpenaiStructuredChatCompletion from './pages/openai/OpenaiStructuredChatCompletion'
import OpenaiSynchronousChatCompletion from './pages/openai/OpenaiSynchronousChatCompletion'
import { routes } from './routes'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path={routes.openai.synchronousChatCompletion}
                element={<OpenaiSynchronousChatCompletion />}
            />
            <Route
                path={routes.openai.structuredChatCompletion}
                element={<OpenaiStructuredChatCompletion />}
            />
            <Route
                path={routes.openai.streamingChatCompletion}
                element={<OpenaiStreamingChatCompletion />}
            />
            <Route
                path={routes.anthropic.synchronousChatCompletion}
                element={<AnthropicSynchronousChatCompletion />}
            />
            <Route
                path={routes.anthropic.streamingChatCompletion}
                element={<AnthropicStreamingChatCompletion />}
            />
            <Route
                path={routes.gemini.synchronousChatCompletion}
                element={<GeminiSynchronousChatCompletion />}
            />
            <Route
                path={routes.gemini.structuredChatCompletion}
                element={<GeminiStructuredChatCompletion />}
            />
            <Route
                path={routes.gemini.streamingChatCompletion}
                element={<GeminiStreamingChatCompletion />}
            />
        </Routes>
    )
}

export default App
