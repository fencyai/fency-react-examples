export const dataPointTypes = [
  'string',
  'stringList',
  'boolean',
  'number',
] as const

export type DataPointType = (typeof dataPointTypes)[number]

export type DataPoint = {
  key: string
  label: string
  type: DataPointType
  description: string
}

export const defaultDataPoints: DataPoint[] = [
  {
    key: 'title',
    label: 'Title',
    type: 'string',
    description: 'The document title or heading',
  },
  {
    key: 'parties',
    label: 'Parties',
    type: 'stringList',
    description: 'Named people or organizations in the document',
  },
  {
    key: 'isSigned',
    label: 'Is signed',
    type: 'boolean',
    description: 'Whether the document appears signed',
  },
  {
    key: 'amount',
    label: 'Amount',
    type: 'number',
    description: 'A primary monetary amount if present',
  },
]
