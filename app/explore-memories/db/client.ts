import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { catTable } from './catTable'
import { memoryTypeTable } from './memoryTypeTable'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined.')
}

const globalForDb = globalThis as unknown as { pool: Pool | undefined }

export const pool = globalForDb.pool ?? new Pool({ connectionString })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool
}

export const db = drizzle(pool, { schema: { catTable, memoryTypeTable } })
