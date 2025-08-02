import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import OpenaiStreamingChatCompletion from './pages/openai/OpenaiStreamingChatCompletion'
import OpenaiSynchronousChatCompletion from './pages/openai/OpenaiSynchronousChatCompletion'
import OpenaiSynchronousChatCompletionWithFormatting from './pages/openai/OpenaiSynchronousChatCompletionWithFormatting'
import AnthropicStreamingChatCompletion from './pages/anthropic/AnthropicStreamingChatCompletion'
import AnthropicSynchronousChatCompletion from './pages/anthropic/AnthropicSynchronousChatCompletion'
import AnthropicSynchronousChatCompletionWithFormatting from './pages/anthropic/AnthropicSynchronousChatCompletionWithFormatting'
import GeminiStreamingChatCompletion from './pages/gemini/GeminiStreamingChatCompletion'
import GeminiSynchronousChatCompletion from './pages/gemini/GeminiSynchronousChatCompletion'
import GeminiSynchronousChatCompletionWithFormatting from './pages/gemini/GeminiSynchronousChatCompletionWithFormatting'
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
                path={routes.openai.synchronousChatCompletionWithFormatting}
                element={<OpenaiSynchronousChatCompletionWithFormatting />}
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
                path={routes.anthropic.synchronousChatCompletionWithFormatting}
                element={<AnthropicSynchronousChatCompletionWithFormatting />}
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
                path={routes.gemini.synchronousChatCompletionWithFormatting}
                element={<GeminiSynchronousChatCompletionWithFormatting />}
            />
            <Route
                path={routes.gemini.streamingChatCompletion}
                element={<GeminiStreamingChatCompletion />}
            />
        </Routes>
    )
}

export default App
