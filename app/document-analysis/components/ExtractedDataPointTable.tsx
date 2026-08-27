import { Card, Text, Title } from '@mantine/core'
import type { DataPoint } from '../dataPoint'
import { ExtractedValue } from './ExtractedValue'

export function ExtractedDataPointTable({
  dataPoints,
  extracted,
}: {
  dataPoints: DataPoint[]
  extracted: Record<string, unknown>
}) {
  return (
    <Card withBorder padding="md" radius="lg">
      <Title order={2} size="h6" mb="sm">
        Extracted data
      </Title>
      <dl className="grid grid-cols-[10rem_1fr] gap-x-3 gap-y-2">
        {dataPoints.map((dataPoint) => (
          <div key={dataPoint.key} className="contents">
            <dt>
              <Text size="sm" c="dimmed" span>
                {dataPoint.label}
              </Text>
            </dt>
            <dd>
              <ExtractedValue value={extracted[dataPoint.key]} />
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
