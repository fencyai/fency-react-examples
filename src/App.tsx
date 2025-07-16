import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import SynchronousChatCompletion from './pages/SynchronousChatCompletion'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/synchronous-chat-completion"
                element={<SynchronousChatCompletion />}
            />
        </Routes>
    )
}

export default App
