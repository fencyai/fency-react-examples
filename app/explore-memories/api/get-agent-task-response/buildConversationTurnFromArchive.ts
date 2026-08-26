import 'server-only'

import { agentTaskFromArchivedResponse } from '@fencyai/js'
import { fetchFencyAgentTaskArchive } from './fetchFencyAgentTaskArchive'

export async function buildConversationTurnFromArchive(
  taskId: string,
  origin: string,
) {
  const { query: apiQuery, archive } = await fetchFencyAgentTaskArchive(
    taskId,
    origin,
  )
  const agentTask = agentTaskFromArchivedResponse(archive)
  const query =
    apiQuery?.trim() ||
    (agentTask.params.type === 'ExploreMemories'
      ? agentTask.params.query
      : '') ||
    'Exploration'

  return {
    id: taskId,
    query,
    agentTask: {
      ...agentTask,
      taskKey: taskId,
      loading: false,
    },
  }
}
