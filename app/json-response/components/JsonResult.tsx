import { Card, Code, Title } from '@mantine/core'
import type { JsonResponse } from '../responseSchema'

export function JsonResult({ result }: { result: JsonResponse }) {
  return (
    <Card withBorder padding="md" radius="md">
      <Title order={2} size="h5" mb="sm">
        JSON
      </Title>
      <Code block>{JSON.stringify(result, null, 2)}</Code>
    </Card>
  )
}
