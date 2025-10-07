import CodeExample from '@/CodeExample'
import { Button, Title } from '@mantine/core'
import { IconFileDownload } from '@tabler/icons-react'
import { Link } from 'react-router'
import ExampleLayout from '../../../ExampleLayout'
import Example from './Example'
import exampleCode from './Example.tsx?raw'

export default function FileFormFillerPage() {
    const example = <Example />
    return (
        <ExampleLayout
            title="File Form Filler"
            description={
                <span className="text-gray-500">
                    Getting suggestions for the fields in a form from a file.{' '}
                    <br />
                    You can use this example file if you want to try it out:
                    <br />
                    <Button
                        component={Link}
                        mt="xs"
                        size="xs"
                        radius="xl"
                        target="_blank"
                        leftSection={<IconFileDownload size={16} />}
                        to="https://fency-public-content.s3.eu-west-1.amazonaws.com/CloudSentinel_Company_Description.pdf"
                        download={true}
                    >
                        Example file
                    </Button>
                </span>
            }
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
