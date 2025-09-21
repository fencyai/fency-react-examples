import { Navigate, Route, Routes } from 'react-router'
import Layout from './Layout'
import BasicChatCompletionPage from './pages/examples/basic-chat-completion'
import ExtractingFileContentPage from './pages/examples/extracting-file-content'
import ExtractingWebsiteContentPage from './pages/examples/extracting-website-content'
import StreamingChatCompletionPage from './pages/examples/streaming-chat-completion'
import StructuredChatCompletionPage from './pages/examples/structured-chat-completion'
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
                <Route
                    path={routes.examples.extractingWebsiteContent}
                    element={<ExtractingWebsiteContentPage />}
                />
                <Route
                    path={routes.examples.extractingFileContent}
                    element={<ExtractingFileContentPage />}
                />
                <Route path={'*'} element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    )
}

export default App
