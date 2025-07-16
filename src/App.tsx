import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import StreamingChatCompletion from './pages/StreamingChatCompletion'
import SynchronousChatCompletion from './pages/SynchronousChatCompletion'
import SynchronousChatCompletionWithFormatting from './pages/SynchronousChatCompletionWithFormatting'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/synchronous-chat-completion"
                element={<SynchronousChatCompletion />}
            />
            <Route
                path="/synchronous-chat-completion-with-formatting"
                element={<SynchronousChatCompletionWithFormatting />}
            />
            <Route
                path="/streaming-chat-completion"
                element={<StreamingChatCompletion />}
            />
        </Routes>
    )
}

export default App
