import { routes } from './routes'

export const examples = [
    {
        title: 'Basic Chat Completion',
        description: 'Synchronous response',
        href: routes.examples.basicChatCompletion,
    },
    {
        title: 'Streaming Chat Completion',
        description: 'Real-time response with streaming',
        href: routes.examples.streamingChatCompletion,
    },
    {
        title: 'Structured Chat Completion',
        description: 'JSON response using a Zod schema',
        href: routes.examples.structuredChatCompletion,
    },
    {
        title: 'Summarizing Website Content',
        description: 'Summarizing the content of a website',
        href: routes.examples.summarizingWebsiteContent,
    },
    {
        title: 'Website Form Filler',
        description: 'Filling out a form from a website',
        href: routes.examples.websiteFormFiller,
    },
    {
        title: 'Summarizing File Content',
        description: 'Summarizing the content of a file',
        href: routes.examples.summarizingFileContent,
    },
    {
        title: 'File Form Filler',
        description: 'Filling out a form from a file',
        href: routes.examples.fileFormFiller,
    },
    {
        title: 'Chat GPT Clone',
        description: 'A clone of Chat GPT',
        href: routes.examples.chatGptClone,
    },
]
