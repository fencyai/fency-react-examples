import 'server-only'

import { fencyJson } from './fencyRequest'

export type FencyMemoryTypeItem = {
  id: string
  name: string
}

export async function listFencyMemoryTypes() {
  const items: FencyMemoryTypeItem[] = []
  let nextPageToken: string | undefined

  for (let page = 0; page < 20; page += 1) {
    const url = new URL('https://api.fency.ai/v1/memory-types')
    url.searchParams.set('limit', '50')
    if (nextPageToken) {
      url.searchParams.set('nextPageToken', nextPageToken)
    }

    const { ok, status, data } = await fencyJson<{
      items?: FencyMemoryTypeItem[]
      pagination?: { nextPageToken?: string | null }
    }>(`${url.pathname}${url.search}`)

    if (!ok) {
      return { ok, status, items }
    }

    items.push(...(data.items ?? []))
    nextPageToken = data.pagination?.nextPageToken ?? undefined
    if (!nextPageToken) {
      break
    }
  }

  return { ok: true, status: 200, items }
}
