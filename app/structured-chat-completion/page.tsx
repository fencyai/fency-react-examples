import { getLatestConversation, listExtractions } from './db/queries'
import { Extractor } from './Extractor'
import { Provider } from './Provider'

export const dynamic = 'force-dynamic'

export default async function StructuredChatCompletionPage() {
  const conversation = await getLatestConversation()
  const extractions = conversation ? await listExtractions(conversation.id) : []

  return (
    <Provider>
      <Extractor
        initialConversation={conversation}
        initialExtractions={extractions}
      />
    </Provider>
  )
}
