import { Navigate, Route, Routes } from 'react-router'
import Layout from './Layout'
import BasicChatCompletionPage from './pages/examples/basic-chat-completion'
import FileFormFillerPage from './pages/examples/file-form-filler'
import StreamingChatCompletionPage from './pages/examples/streaming-chat-completion'
import StructuredChatCompletionPage from './pages/examples/structured-chat-completion'
import SummarizingFileContentPage from './pages/examples/summarizing-file-content'
import SummarizingWebsiteContentPage from './pages/examples/summarizing-website-content'
import Home from './pages/Home'
import { routes } from './routes'
import WebsiteFormFillerPage from './pages/examples/website-form-filler'
import ChatGptClonePage from './pages/examples/chat-gpt-clone'
import RunningLocallyPage from './pages/running-locally'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route
                    path={routes.runningLocally}
                    element={<RunningLocallyPage />}
                />
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
                    path={routes.examples.summarizingWebsiteContent}
                    element={<SummarizingWebsiteContentPage />}
                />
                <Route
                    path={routes.examples.summarizingFileContent}
                    element={<SummarizingFileContentPage />}
                />
                <Route
                    path={routes.examples.fileFormFiller}
                    element={<FileFormFillerPage />}
                />
                <Route
                    path={routes.examples.websiteFormFiller}
                    element={<WebsiteFormFillerPage />}
                />
                <Route
                    path={routes.examples.chatGptClone}
                    element={<ChatGptClonePage />}
                />
                <Route path={'*'} element={<Navigate to="/" replace />} />
                <Route path={'*/*'} element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    )
}

export default App
