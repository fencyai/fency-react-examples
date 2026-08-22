import { createSession } from '../../fency'

export async function POST() {
  return createSession({
    createAgentTask: {
      taskType: 'STRUCTURED_CHAT_COMPLETION',
    },
  })
}
