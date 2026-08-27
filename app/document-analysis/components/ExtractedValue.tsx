import { Text } from '@mantine/core'

export function ExtractedValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return (
      <Text size="sm" c="dimmed">
        -
      </Text>
    )
  }
  if (typeof value === 'boolean') {
    return <Text size="sm">{value ? 'true' : 'false'}</Text>
  }
  if (Array.isArray(value)) {
    const items = value.filter((item) => typeof item === 'string')
    if (items.length === 0) {
      return (
        <Text size="sm" c="dimmed">
          -
        </Text>
      )
    }
    return <Text size="sm">{items.join(', ')}</Text>
  }
  return <Text size="sm">{String(value)}</Text>
}
