import { Code, Text } from '@mantine/core'
import { extractionJsonSchema } from '../extractionSchema'

type JsonSchemaProperty = {
  type?: string
  description?: string
}

type JsonSchema = {
  properties?: Record<string, JsonSchemaProperty>
}

const schema = JSON.parse(extractionJsonSchema) as JsonSchema
const fields = Object.entries(schema.properties ?? {}).map(
  ([name, property]) => ({
    name,
    type: property.type ?? 'unknown',
    description: property.description ?? '',
  }),
)

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
              {field.type}
              {field.description ? ` - ${field.description}` : ''}
            </Text>
          </dd>
        </div>
      ))}
    </dl>
  )
}
