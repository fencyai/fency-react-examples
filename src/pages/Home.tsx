import { examples } from '@/examples'
import { Container, List, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router'

export default function Home() {
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
                        Running this project locally
                    </Title>
                    <Text size="sm" c="dimmed">
                        You can run this project locally by{' '}
                        <Link
                            to="https://github.com/fencyai/fency-react-examples"
                            className="text-blue-500 hover:text-blue-600 hover:underline"
                        >
                            cloning the repository
                        </Link>{' '}
                        and following the instructions in the README.
                    </Text>
                </div>
                <div>
                    <Title order={5} mb="sm">
                        Examples
                    </Title>
                    <List>
                        {examples.map((example) => (
                            <List.Item key={example.href}>
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
