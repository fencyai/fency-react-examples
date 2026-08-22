import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  loadEnv({ path: '.env' })
  loadEnv({ path: '.env.local', override: true })
}

const defaultUrl =
  'postgresql://fency_examples:fency_examples@127.0.0.1:10120/fency_examples'

export default defineConfig({
  schema: [
    './app/streaming-chat-completion/db/schema.ts',
    './app/structured-chat-completion/db/schema.ts',
    './app/explore-memories/db/schema.ts',
  ],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? defaultUrl,
  },
})
