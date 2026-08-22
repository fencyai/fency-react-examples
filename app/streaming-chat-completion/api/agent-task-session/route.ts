import { createSession } from '../../fency'

export async function POST() {
  return createSession({
    createAgentTask: {
      taskType: 'STREAMING_CHAT_COMPLETION',
    },
  })
}
