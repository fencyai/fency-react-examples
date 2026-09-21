export type Difficulty = 'basic' | 'intermediate' | 'advanced'

export const examplesCatalog = [
  {
    href: '/streaming-response',
    title: 'Streaming response',
    description: 'One prompt. The reply streams in as it is generated.',
    guide: 'https://docs.fency.ai/docs/integration/streaming-response',
    difficulty: 'basic',
  },
  {
    href: '/json-response',
    title: 'JSON response',
    description:
      'One prompt. The reply is a JSON object with a string, a boolean, and a number.',
    guide: 'https://docs.fency.ai/docs/integration/json-response',
    difficulty: 'basic',
  },
  {
    href: '/basic-chat',
    title: 'Basic chat',
    description: 'A multi-turn chat. Each reply streams in.',
    guide: 'https://docs.fency.ai/docs/integration/basic-chat',
    difficulty: 'basic',
  },
  {
    href: '/json-extraction',
    title: 'JSON extraction',
    description: 'Paste free text and get a typed record back.',
    guide: 'https://docs.fency.ai/docs/integration/json-extraction',
    difficulty: 'basic',
  },
  {
    href: '/document-json-extraction',
    title: 'Document JSON extraction',
    description: 'Upload a PDF and pull typed fields out of it.',
    guide: 'https://docs.fency.ai/docs/integration/document-json-extraction',
    difficulty: 'intermediate',
  },
  {
    href: '/data-exploration',
    title: 'Data exploration',
    description: 'Ask questions over a per-user catalog.',
    guide: 'https://docs.fency.ai/docs/integration/data-exploration',
    difficulty: 'advanced',
  },
] as const
