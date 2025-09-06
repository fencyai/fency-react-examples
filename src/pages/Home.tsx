import { Title, Text, Container, Stack, Card } from '@mantine/core'

export default function Home() {
    return (
        <Container size="lg">
            <Stack gap="xl">
                <div>
                    <Title order={1} mb="md">
                        Welcome to React Examples
                    </Title>
                    <Text size="lg" c="dimmed">
                        Explore various AI chat completion examples using different providers and patterns.
                    </Text>
                </div>

                <div>
                    <Title order={2} mb="md">
                        Available Examples
                    </Title>
                    <Stack gap="md">
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={3} mb="sm">
                                OpenAI Examples
                            </Title>
                            <Text size="sm" c="dimmed" mb="sm">
                                Explore OpenAI's chat completion capabilities
                            </Text>
                            <ul>
                                <li>Synchronous Chat Completion</li>
                                <li>Structured Chat Completion (with Zod schemas)</li>
                                <li>Streaming Chat Completion</li>
                            </ul>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={3} mb="sm">
                                Anthropic Examples
                            </Title>
                            <Text size="sm" c="dimmed" mb="sm">
                                Discover Anthropic's Claude API features
                            </Text>
                            <ul>
                                <li>Synchronous Chat Completion</li>
                                <li>Streaming Chat Completion</li>
                            </ul>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={3} mb="sm">
                                Gemini Examples
                            </Title>
                            <Text size="sm" c="dimmed" mb="sm">
                                Try Google's Gemini AI capabilities
                            </Text>
                            <ul>
                                <li>Synchronous Chat Completion</li>
                                <li>Structured Chat Completion (with Zod schemas)</li>
                                <li>Streaming Chat Completion</li>
                            </ul>
                        </Card>
                    </Stack>
                </div>

                <div>
                    <Title order={2} mb="md">
                        Getting Started
                    </Title>
                    <Text size="sm" c="dimmed">
                        Use the sidebar to navigate between different examples. Each example demonstrates
                        a specific pattern for working with AI chat completion APIs.
                    </Text>
                </div>
            </Stack>
        </Container>
    )
}
