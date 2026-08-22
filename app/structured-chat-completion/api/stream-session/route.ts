import { createSession } from '../../fency'

export async function POST() {
  return createSession({ createStream: {} })
}
