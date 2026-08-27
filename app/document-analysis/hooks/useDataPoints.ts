'use client'

import { useState } from 'react'
import { defaultDataPoints, type DataPoint } from '../dataPoint'

function keyFromLabel(label: string, usedKeys: Set<string>) {
  const base =
    label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '') || 'field'
  if (!usedKeys.has(base)) {
    return base
  }
  let index = 2
  while (usedKeys.has(`${base}_${index}`)) {
    index += 1
  }
  return `${base}_${index}`
}

function withDerivedKeys(dataPoints: DataPoint[]) {
  const usedKeys = new Set<string>()
  return dataPoints.map((dataPoint) => {
    const key = keyFromLabel(dataPoint.label, usedKeys)
    usedKeys.add(key)
    return { ...dataPoint, key }
  })
}

export function useDataPoints() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(defaultDataPoints)

  function addDataPoint() {
    setDataPoints((current) =>
      withDerivedKeys([
        ...current,
        {
          key: 'field',
          label: 'New field',
          type: 'string',
          description: '',
        },
      ]),
    )
  }

  function updateDataPoint(
    index: number,
    patch: Partial<Pick<DataPoint, 'label' | 'type' | 'description'>>,
  ) {
    setDataPoints((current) =>
      withDerivedKeys(
        current.map((dataPoint, i) =>
          i === index ? { ...dataPoint, ...patch } : dataPoint,
        ),
      ),
    )
  }

  function removeDataPoint(index: number) {
    setDataPoints((current) =>
      withDerivedKeys(current.filter((_, i) => i !== index)),
    )
  }

  return {
    dataPoints,
    addDataPoint,
    updateDataPoint,
    removeDataPoint,
  }
}
