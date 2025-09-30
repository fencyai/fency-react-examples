import CodeExample from '@/CodeExample'
import { Title } from '@mantine/core'
import ExampleLayout from '../../../ExampleLayout'
import Example from './Example'
import exampleCode from './Example.tsx?raw'

export default function SummarizingFileContentPage() {
    const example = <Example />
    return (
        <ExampleLayout
            title="Summarizing File Content"
            description="Summarizing the content of a file."
        >
            <Title order={3} className="text-gray-400 pb-2">
                Example
            </Title>
            {example}
            <Title order={3} className="text-gray-400 pb-2">
                Code
            </Title>
            <CodeExample code={exampleCode} />
        </ExampleLayout>
    )
}
