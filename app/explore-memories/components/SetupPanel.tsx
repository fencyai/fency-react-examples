import { Alert, Button, Stack, Text, Title } from '@mantine/core'

export function SetupPanel({
  isCreating,
  error,
  onCreateCatalog,
}: {
  isCreating: boolean
  error: string | null
  onCreateCatalog: () => void
}) {
  return (
    <Stack
      maw={480}
      mx="auto"
      mt="xl"
      gap="md"
      p="lg"
      style={{
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 'var(--mantine-radius-lg)',
      }}
    >
      <Title order={2} size="h4">
        Set up Explore memories
      </Title>
      <Text size="sm">
        This demo explores a catalog of 100 cars. Fency requires a metadata
        memory type and guard rails before EXPLORE_MEMORIES can run. Click the
        button to create the DemoCar type, seed the cars in Postgres, and sync
        them to Fency.
      </Text>
      {error ? <Alert color="red">{error}</Alert> : null}
      <Button
        variant="default"
        loading={isCreating}
        onClick={onCreateCatalog}
      >
        Create car catalog
      </Button>
    </Stack>
  )
}
