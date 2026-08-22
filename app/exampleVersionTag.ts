import 'server-only'

const EXAMPLE_VERSION_TAG_ENV = {
  'explore-memories': 'EXPLORE_MEMORIES_VERSION_TAG',
} as const

export type VersionedExample = keyof typeof EXAMPLE_VERSION_TAG_ENV

export function getExampleVersionTag(example: VersionedExample): string {
  const envName = EXAMPLE_VERSION_TAG_ENV[example]
  const value = process.env[envName]?.trim()
  if (!value) {
    throw new Error(`${envName} is not defined.`)
  }
  return value
}
