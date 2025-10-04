import CodeExample from '@/CodeExample'
import { Title } from '@mantine/core'
import ExampleLayout from '../../../ExampleLayout'
import Example from './Example'
import exampleCode from './Example.tsx?raw'

export default function WebsiteFormFillerPage() {
    const example = <Example />
    return (
        <ExampleLayout
            title="Website Form Filler"
            description="Filling out a form from a website."
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
