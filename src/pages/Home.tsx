import { Link } from 'react-router'
import { routes } from '../routes'

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <span className="text-4xl font-bold">Fency React Examples</span>
            <div className="mt-3 flex flex-col gap-2 items-center">
                <h2 className="text-2xl font-bold">OpenAI</h2>
                <Link
                    to={routes.openai.synchronousChatCompletion}
                    className="text-blue-500"
                >
                    Synchronous Chat Completion
                </Link>
                <Link
                    to={routes.openai.synchronousChatCompletionWithFormatting}
                    className="text-blue-500"
                >
                    Synchronous Chat Completion With Formatting
                </Link>
                <Link
                    to={routes.openai.streamingChatCompletion}
                    className="text-blue-500"
                >
                    Streaming Chat Completion
                </Link>
            </div>
            <div className="mt-3 flex flex-col gap-2 items-center">
                <h2 className="text-2xl font-bold">Anthropic</h2>
                <Link
                    to={routes.anthropic.synchronousChatCompletion}
                    className="text-blue-500"
                >
                    Synchronous Chat Completion
                </Link>
                <Link
                    to={routes.anthropic.synchronousChatCompletionWithFormatting}
                    className="text-blue-500"
                >
                    Synchronous Chat Completion With Formatting
                </Link>
                <Link
                    to={routes.anthropic.streamingChatCompletion}
                    className="text-blue-500"
                >
                    Streaming Chat Completion
                </Link>
            </div>

            <div className="mt-3 flex flex-col gap-2 items-center">
                <h2 className="text-2xl font-bold">Gemini</h2>
                <Link
                    to={routes.gemini.synchronousChatCompletion}
                    className="text-blue-500"
                >
                    Synchronous Chat Completion
                </Link>
                <Link
                    to={routes.gemini.synchronousChatCompletionWithFormatting}
                    className="text-blue-500"
                >
                    Synchronous Chat Completion With Formatting
                </Link>
                <Link
                    to={routes.gemini.streamingChatCompletion}
                    className="text-blue-500"
                >
                    Streaming Chat Completion
                </Link>
            </div>
        </div>
    )
}
