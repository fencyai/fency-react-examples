'use client'

import { Button, Stack, Text, Title } from '@mantine/core'
import type { DataPoint } from '../dataPoint'
import { DataPointRow } from './DataPointRow'

export function DataPointForm({
  dataPoints,
  disabled,
  onAdd,
  onChange,
  onRemove,
}: {
  dataPoints: DataPoint[]
  disabled: boolean
  onAdd: () => void
  onChange: (
    index: number,
    patch: Partial<Pick<DataPoint, 'label' | 'type' | 'description'>>,
  ) => void
  onRemove: (index: number) => void
}) {
  return (
    <Stack gap="sm">
      <div>
        <Title order={2} size="h5">
          Data points
        </Title>
        <Text size="sm" c="dimmed">
          Each row becomes a MemorySearch query, then a typed field in the
          structured result.
        </Text>
      </div>
      {dataPoints.map((dataPoint, index) => (
        <DataPointRow
          key={dataPoint.key}
          dataPoint={dataPoint}
          disabled={disabled}
          onChange={(patch) => onChange(index, patch)}
          onRemove={() => onRemove(index)}
        />
      ))}
      <Button
        variant="default"
        onClick={onAdd}
        disabled={disabled}
        style={{ alignSelf: 'flex-start' }}
      >
        Add data point
      </Button>
    </Stack>
  )
}
