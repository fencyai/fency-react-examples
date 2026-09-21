'use client'

import { Button, Select, TextInput } from '@mantine/core'
import { dataPointTypes, type DataPoint, type DataPointType } from '../dataPoint'

function parseDataPointType(value: string | null): DataPointType | null {
  for (const type of dataPointTypes) {
    if (type === value) {
      return type
    }
  }
  return null
}

const typeLabels: Record<DataPointType, string> = {
  string: 'string',
  stringList: 'string list',
  boolean: 'boolean',
  number: 'number',
}

export function DataPointRow({
  dataPoint,
  disabled,
  onChange,
  onRemove,
}: {
  dataPoint: DataPoint
  disabled: boolean
  onChange: (patch: Partial<Pick<DataPoint, 'label' | 'type' | 'description'>>) => void
  onRemove: () => void
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_10rem_1fr_auto]">
      <TextInput
        value={dataPoint.label}
        onChange={(event) => onChange({ label: event.currentTarget.value })}
        placeholder="Label"
        disabled={disabled}
      />
      <Select
        value={dataPoint.type}
        onChange={(value) => {
          const type = parseDataPointType(value)
          if (type) {
            onChange({ type })
          }
        }}
        data={dataPointTypes.map((type) => ({
          value: type,
          label: typeLabels[type],
        }))}
        disabled={disabled}
        allowDeselect={false}
      />
      <TextInput
        value={dataPoint.description}
        onChange={(event) =>
          onChange({ description: event.currentTarget.value })
        }
        placeholder="Description"
        disabled={disabled}
      />
      <Button
        variant="default"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${dataPoint.label}`}
      >
        Remove
      </Button>
    </div>
  )
}
