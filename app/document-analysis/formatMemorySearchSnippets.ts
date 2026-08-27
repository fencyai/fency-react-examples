export function formatMemorySearchSnippets(payload: {
  query: string
  items: Array<{
    memoryTitle: string
    matchingChunk: { content: string; pageNumbers: number[] }
    chunks: Array<{
      content: string
      relation: string
      pageNumbers: number[]
    }>
  }>
}) {
  const sections = [`Query used: ${payload.query}`]
  for (let i = 0; i < payload.items.length; i += 1) {
    const item = payload.items[i]
    sections.push('')
    sections.push(`### Hit ${i + 1}: ${item.memoryTitle}`)
    sections.push('**Matching excerpt**')
    sections.push(item.matchingChunk.content)
    sections.push('')
    sections.push('_Surrounding chunks_')
    for (const chunk of item.chunks) {
      sections.push(
        `- [${chunk.relation}] pages ${chunk.pageNumbers.join(', ')}`,
      )
      sections.push(chunk.content)
    }
  }
  return sections.join('\n')
}
