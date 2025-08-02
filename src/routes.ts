export const routes = {
    openai: {
        synchronousChatCompletion: '/openai-synchronous-chat-completion',
        synchronousChatCompletionWithFormatting:
            '/openai-synchronous-chat-completion-with-formatting',
        streamingChatCompletion: '/openai-streaming-chat-completion',
    },
    anthropic: {
        synchronousChatCompletion: '/anthropic-synchronous-chat-completion',
        synchronousChatCompletionWithFormatting:
            '/anthropic-synchronous-chat-completion-with-formatting',
        streamingChatCompletion: '/anthropic-streaming-chat-completion',
    },
    gemini: {
        synchronousChatCompletion: '/gemini-synchronous-chat-completion',
        synchronousChatCompletionWithFormatting:
            '/gemini-synchronous-chat-completion-with-formatting',
        streamingChatCompletion: '/gemini-streaming-chat-completion',
    },
}
