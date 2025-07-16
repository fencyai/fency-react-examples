import { Link } from 'react-router'

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <span className="text-4xl font-bold">Fency React Examples</span>
            <div className="mt-3 flex flex-col gap-2 items-center">
                <Link
                    to="/synchronous-chat-completion"
                    className="text-blue-500"
                >
                    Synchronous Chat Completion
                </Link>
                <Link
                    to="/synchronous-chat-completion-with-formatting"
                    className="text-blue-500"
                >
                    Synchronous Chat Completion With Formatting
                </Link>
                <Link
                    to="/streaming-chat-completion"
                    className="text-blue-500"
                >
                    Streaming Chat Completion
                </Link>
            </div>
        </div>
    )
}
