import { Chat } from './Chat'
import { getLatestConversation, listMessages } from './db/queries'
import { Provider } from './Provider'

export const dynamic = 'force-dynamic'

export default async function StreamingChatCompletionPage() {
  const conversation = await getLatestConversation()
  const messages = conversation ? await listMessages(conversation.id) : []

  return (
    <Provider>
      <Chat initialConversation={conversation} initialMessages={messages} />
    </Provider>
  )
}
