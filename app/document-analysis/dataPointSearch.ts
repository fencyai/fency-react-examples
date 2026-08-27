import type { AgentTask } from '@fencyai/react'

export type DataPointSearch = {
  taskKey: string
  label: string
  query: string
}

export type DataPointSearchWithTask = DataPointSearch & {
  task: AgentTask | undefined
}
