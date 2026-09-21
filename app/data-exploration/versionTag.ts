import 'server-only'

export function getExploreMemoriesVersionTag() {
  const value = process.env.EXPLORE_MEMORIES_VERSION_TAG?.trim()
  if (!value) {
    throw new Error('EXPLORE_MEMORIES_VERSION_TAG is not defined.')
  }
  return value
}
