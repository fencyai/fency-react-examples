import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'

const defaultUrl =
  'postgresql://fency_examples:fency_examples@127.0.0.1:10120/fency_examples'

const connectionString = process.env.DATABASE_URL ?? defaultUrl

const globalForDb = globalThis as unknown as {
  streamingChatPool: pg.Pool | undefined
}

export const pool =
  globalForDb.streamingChatPool ?? new pg.Pool({ connectionString })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.streamingChatPool = pool
}

export const db = drizzle(pool, { schema })
