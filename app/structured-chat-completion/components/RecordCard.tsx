import { Card, Text, Title } from '@mantine/core'
import type { Extraction } from '../extractionSchema'

export function RecordCard({
  title,
  record,
}: {
  title: string
  record: Extraction
}) {
  const fields = [
    ['Name', record.name],
    ['Role', record.role],
    ['Company', record.company],
    ['Email', record.email],
    ['Summary', record.summary],
  ] as const

  return (
    <Card withBorder padding="md" radius="lg">
      <Title order={2} size="h6" mb="sm">
        {title}
      </Title>
      <dl className="grid grid-cols-[8rem_1fr] gap-x-3 gap-y-1">
        {fields.map(([label, value]) => (
          <div key={label} className="contents">
            <dt>
              <Text size="sm" c="dimmed" span>
                {label}
              </Text>
            </dt>
            <dd>
              <Text size="sm" span>
                {value}
              </Text>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
