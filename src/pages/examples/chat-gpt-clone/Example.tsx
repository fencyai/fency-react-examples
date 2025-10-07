import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Message, MessageContent } from '@/components/ai-elements/message'
import {
    PromptInput,
    PromptInputSubmit,
    PromptInputTextarea,
} from '@/components/ai-elements/prompt-input'
import { Response } from '@/components/ai-elements/response'
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion'
import { useStreamingChatCompletions } from '@fencyai/react'
import { MessageSquare } from 'lucide-react'
import { useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Message {
    id: string
    from: 'user' | 'assistant'
    content: string
}

export default function Example() {
    const [prompt, setPrompt] = useState('')
    const { createStreamingChatCompletion, latest } =
        useStreamingChatCompletions()

    const messages = useMemo(() => {
        const latestContext: Message[] =
            latest?.prompt.generic?.messages.flatMap((message) => {
                if (message.role === 'system') {
                    return []
                }

                return {
                    id: uuidv4(),
                    from: message.role,
                    content: message.content,
                }
            }) ?? []

        if (latest?.response) {
            latestContext.push({
                id: uuidv4(),
                from: 'assistant',
                content: latest.response,
            })
        }

        return latestContext
    }, [latest])

    const onSubmit = (input: string) => {
        createStreamingChatCompletion({
            generic: {
                messages: [
                    ...messages.map((message) => ({
                        role: message.from,
                        content: message.content,
                    })),
                    { role: 'user', content: input },
                ],
                model: 'gpt-4.1-mini',
            },
        })
    }

    const suggestions = [
        'Show me a table of 5 famous actors and their most popular movies.',
        'What are the latest trends in AI?',
    ]

    return (
        <div className='mb-4'>
            <Conversation
                className="relative w-full"
                style={{ height: '300px' }}
            >
                <ConversationContent>
                    {messages.length === 0 ? (
                        <ConversationEmptyState
                            icon={<MessageSquare className="size-12" />}
                            title="No messages yet"
                            description="Start a conversation to see messages here"
                        />
                    ) : (
                        messages.map((message) => (
                            <Message from={message.from} key={message.id}>
                                <MessageContent>
                                    <Response>{message.content}</Response>
                                </MessageContent>
                            </Message>
                        ))
                    )}
                </ConversationContent>
                <ConversationScrollButton />
            </Conversation>

            <Suggestions>
                {suggestions.map((suggestion) => (
                    <Suggestion
                        key={suggestion}
                        suggestion={suggestion}
                        onClick={() => onSubmit(suggestion)}
                    />
                ))}
            </Suggestions>

            <PromptInput
                onSubmit={() => onSubmit(prompt)}
                className="mt-4 w-full mx-auto relative"
            >
                <PromptInputTextarea
                    value={prompt}
                    placeholder="Say something..."
                    onChange={(e) => setPrompt(e.currentTarget.value)}
                    className="pr-12"
                />
                <PromptInputSubmit
                    disabled={!prompt.trim()}
                    className="absolute bottom-1 right-1"
                />
            </PromptInput>
        </div>
    )
}
