import { Route, Routes } from 'react-router'
import Layout from './Layout'
import BasicChatCompletionPage from './pages/examples/basic-chat-completion'
import StreamingChatCompletionPage from './pages/examples/streaming-chat-completion'
import StructuredChatCompletionPage from './pages/examples/strucutred-chat-completion'
import Home from './pages/Home'
import { routes } from './routes'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route
                    path={routes.examples.basicChatCompletion}
                    element={<BasicChatCompletionPage />}
                />
                <Route
                    path={routes.examples.streamingChatCompletion}
                    element={<StreamingChatCompletionPage />}
                />
                <Route
                    path={routes.examples.structuredChatCompletion}
                    element={<StructuredChatCompletionPage />}
                />
            </Route>
        </Routes>
    )
}

export default App
