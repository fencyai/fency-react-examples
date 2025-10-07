import { Title } from '@mantine/core'
import type { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
    title: string
    description?: React.ReactNode
}

export default function ExampleLayout({ title, description, children }: Props) {
    return (
        <div className="p-2 max-w-5xl mx-auto">
            <Title className="text-gray-700">{title}</Title>
            {description && (
                <div className="mt-2">
                    <span className="text-gray-500">{description}</span>
                </div>
            )}
            <div className="mt-2">{children}</div>
        </div>
    )
}
