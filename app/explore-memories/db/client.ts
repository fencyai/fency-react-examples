import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'

const defaultUrl =
  'postgresql://fency_examples:fency_examples@127.0.0.1:10120/fency_examples'

const connectionString = process.env.DATABASE_URL ?? defaultUrl

const globalForDb = globalThis as unknown as {
  exploreMemoriesPool: pg.Pool | undefined
}

export const pool =
  globalForDb.exploreMemoriesPool ?? new pg.Pool({ connectionString })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.exploreMemoriesPool = pool
}

export const db = drizzle(pool, { schema })
