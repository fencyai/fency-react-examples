'use client'

import { Badge, Stack, Text, Title } from '@mantine/core'
import { useEffect, useRef } from 'react'
import { useBasicChat } from '../hooks/useBasicChat'
import { ChatComposer } from './ChatComposer'
import { ChatTurn } from './ChatTurn'

export function Chat() {
  const { turns, isSubmitting, sendMessage } = useBasicChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [turns, isSubmitting])

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col">
      <div className="px-4 py-3">
        <Badge size="sm" variant="light" color="green" mb={4}>
          Basic
        </Badge>
        <Title order={1} size="h4">
          Basic chat
        </Title>
        <Text size="sm" c="dimmed">
          A multi-turn chat. Each reply streams in.
        </Text>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {turns.length === 0 ? (
          <Stack align="center" gap={4} py="xl">
            <Title order={2} size="h5">
              Start chatting
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              Send a message to begin.
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
