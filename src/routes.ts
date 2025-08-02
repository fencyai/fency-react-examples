export const routes = {
    openai: {
        synchronousChatCompletion: '/openai/synchronous-chat-completion',
        structuredChatCompletion: '/openai/structured-chat-completion',
        streamingChatCompletion: '/openai/streaming-chat-completion',
    },
    anthropic: {
        synchronousChatCompletion: '/anthropic/synchronous-chat-completion',
        streamingChatCompletion: '/anthropic/streaming-chat-completion',
    },
    gemini: {
        synchronousChatCompletion: '/gemini/synchronous-chat-completion',
        structuredChatCompletion: '/gemini/structured-chat-completion',
        streamingChatCompletion: '/gemini/streaming-chat-completion',
    },
}
