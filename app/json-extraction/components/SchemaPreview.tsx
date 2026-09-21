import { Code, Text } from '@mantine/core'
import { z } from 'zod'
import { extractionJsonSchema } from '../extractionSchema'

const jsonSchemaPreviewSchema = z.object({
  properties: z.record(
    z.string(),
    z.object({
      type: z.string(),
      description: z.string(),
    }),
  ),
})

const schema = jsonSchemaPreviewSchema.parse(JSON.parse(extractionJsonSchema))
const fields = Object.entries(schema.properties).map(([name, property]) => ({
  name,
  type: property.type,
  description: property.description,
}))

export function SchemaPreview() {
  return (
    <dl className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1">
      {fields.map((field) => (
        <div key={field.name} className="contents">
          <dt>
            <Code>{field.name}</Code>
          </dt>
          <dd>
            <Text size="xs" c="dimmed">
              {field.type} - {field.description}
            </Text>
          </dd>
        </div>
      ))}
    </dl>
  )
}
