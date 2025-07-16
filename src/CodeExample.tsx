import { CodeHighlight } from '@mantine/code-highlight'
import { ActionIcon } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { IconCheck, IconCopy, IconFileTypeTsx } from '@tabler/icons-react'

interface Props {
    code: string
}

export default function CodeExample({ code }: Props) {
    const copy = useClipboard({ timeout: 500 })
    return (
        <div className="bg-gray-100 p-2 rounded-md relative">
            <div className="absolute top-2 right-2">
                <ActionIcon onClick={() => copy.copy(code)} variant="subtle">
                    {copy.copied ? (
                        <IconCheck size={16} className="text-gray-500" />
                    ) : (
                        <IconCopy size={16} className="text-gray-500" />
                    )}
                </ActionIcon>
            </div>
            <div className="inline-flex items-center gap-2 text-gray-500 ml-3 bg-white rounded-md px-2 py-1 mt-1">
                <IconFileTypeTsx size={16} />{' '}
                <span className="text-sm font-semibold mr-2">Example.tsx</span>
            </div>
            <div>
                <CodeHighlight
                    code={code}
                    language="tsx"
                    radius="md"
                    background="transparent"
                />
            </div>
        </div>
    )
}
