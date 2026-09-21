'use client'

import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { useEffect, useRef } from 'react'
import { useStreamingChat } from '../hooks/useStreamingChat'
import { ChatComposer } from './ChatComposer'
import { ChatTurn } from './ChatTurn'

export function Chat() {
  const { turns, isSubmitting, sendMessage, startNewChat } = useStreamingChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [turns, isSubmitting])

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col">
      <Group justify="space-between" align="flex-start" px="md" py="sm" wrap="nowrap">
        <div>
          <Title order={1} size="h4">
            Streaming chat completion
          </Title>
          <Text size="sm" c="dimmed">
            Tokens stream in as they are generated.
          </Text>
        </div>
        <Button variant="default" size="sm" onClick={startNewChat}>
          New chat
        </Button>
      </Group>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {turns.length === 0 ? (
          <Stack align="center" gap={4} py="xl">
            <Title order={2} size="h5">
              Start streaming
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              Send a message to stream tokens as they arrive.
            </Text>
          </Stack>
        ) : null}

        <Stack gap="md">
          {turns.map((turn, index) => (
            <ChatTurn key={index} turn={turn} />
          ))}
        </Stack>
      </div>

      <ChatComposer isSubmitting={isSubmitting} onSend={sendMessage} />
    </div>
  )
}
