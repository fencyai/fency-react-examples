import { Button, Stack, Textarea } from '@mantine/core'

export function ChatComposer({
  value,
  disabled,
  isSubmitting,
  onChange,
  onSubmit,
}: {
  value: string
  disabled: boolean
  isSubmitting: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Stack gap="sm">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          rows={3}
          disabled={disabled}
          placeholder="Ask a question over your memories..."
        />
        <Button
          type="submit"
          variant="default"
          disabled={disabled || !value.trim()}
          style={{ alignSelf: 'flex-end' }}
        >
          {isSubmitting ? 'Exploring...' : 'Explore'}
        </Button>
      </Stack>
    </form>
  )
}
