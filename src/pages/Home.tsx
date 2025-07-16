import { Link } from 'react-router'

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <span className="text-4xl font-bold">Fency React Example</span>
            <div>
                <Link
                    to="/synchronous-chat-completion"
                    className="text-blue-500"
                >
                    Synchronous Chat Completion
                </Link>
            </div>
        </div>
    )
}
