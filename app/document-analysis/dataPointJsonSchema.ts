import { z } from 'zod'
import type { DataPoint } from './dataPoint'

function fieldForDataPoint(dataPoint: DataPoint) {
  const description = dataPoint.description || dataPoint.label
  switch (dataPoint.type) {
    case 'string':
      return z.string().nullish().describe(description)
    case 'stringList':
      return z.array(z.string()).nullish().describe(description)
    case 'boolean':
      return z.boolean().nullish().describe(description)
    case 'number':
      return z.number().nullish().describe(description)
  }
}

export function dataPointZodSchema(dataPoints: DataPoint[]) {
  const shape: Record<string, ReturnType<typeof fieldForDataPoint>> = {}
  for (const dataPoint of dataPoints) {
    shape[dataPoint.key] = fieldForDataPoint(dataPoint)
  }
  return z.object(shape)
}

export function dataPointJsonSchema(dataPoints: DataPoint[]) {
  return JSON.stringify(z.toJSONSchema(dataPointZodSchema(dataPoints)))
}
