export function buildDocumentGuardRails(
  memoryTypeId: string,
  memoryId: string,
) {
  return {
    memoryTypes: [
      {
        memoryTypeId,
        memoryIds: [memoryId],
      },
    ],
  }
}
