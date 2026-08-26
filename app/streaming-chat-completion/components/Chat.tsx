'use client'

import { Button, Group, Text, Title } from '@mantine/core'
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
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
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

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
        {turns.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            Send a message to start streaming.
          </Text>
        ) : null}

        {turns.map((turn, index) => (
          <ChatTurn key={index} turn={turn} />
        ))}
      </div>

      <ChatComposer isSubmitting={isSubmitting} onSend={sendMessage} />
    </div>
  )
}
