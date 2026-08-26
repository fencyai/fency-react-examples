import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  loadEnv({ path: '.env.local' })
}

export default defineConfig({
  schema: './app/explore-memories/db/*Table.ts',
  out: './app/explore-memories/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
})
