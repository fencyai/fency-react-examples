import { getLatestConversation, listQueries } from './db/queries'
import { Explorer } from './Explorer'
import { Provider } from './Provider'

export const dynamic = 'force-dynamic'

export default async function ExploreMemoriesPage() {
  const conversation = await getLatestConversation()
  const queries = conversation ? await listQueries(conversation.id) : []

  return (
    <Provider>
      <Explorer
        initialConversation={conversation}
        initialQueries={queries}
      />
    </Provider>
  )
}
