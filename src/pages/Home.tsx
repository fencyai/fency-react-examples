import { examples } from '@/examples'
import { Button, Container, List, Stack, Text, Title } from '@mantine/core'
import { IconBook } from '@tabler/icons-react'
import { Link } from 'react-router'
import RunningLocallyDescription from './running-locally/RunningLocallyDescription'

export default function Home() {
    const docsUrl = 'https://docs.fency.ai'
    return (
        <Container size="lg">
            <Stack gap="xl">
                <div>
                    <Title order={1} mb="sm" className="text-gray-500">
                        Welcome to Fency React Examples
                    </Title>
                    <Text size="sm" c="dimmed">
                        This page contains examples of different patterns for
                        using Fency with React.
                    </Text>
                </div>
                <div>
                    <Title order={5} mb="sm">
                        Understand the basics
                    </Title>
                    We recommend that you at least read up on the basics of
                    Fency AI before you start in our docs.
                    <br />
                    <Button
                        component={Link}
                        size="xs"
                        className="mt-3"
                        radius={'xl'}
                        to={docsUrl}
                        target="_blank"
                        leftSection={<IconBook size={16} />}
                    >
                        Documentation
                    </Button>
                </div>
                <div>
                    <Title order={5} mb="sm">
                        Running this project locally
                    </Title>
                    <RunningLocallyDescription />
                </div>
                <div>
                    <Title order={5} mb="sm">
                        Examples
                    </Title>
                    <List>
                        {examples.map((example) => (
                            <List.Item key={example.href} className="-ml-5">
                                <Link
                                    to={example.href}
                                    className="text-blue-500 hover:text-blue-600 hover:underline"
                                >
                                    {example.title}
                                </Link>
                            </List.Item>
                        ))}
                    </List>
                </div>
            </Stack>
        </Container>
    )
}
