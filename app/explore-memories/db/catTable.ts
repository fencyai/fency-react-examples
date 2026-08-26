import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

export const catTable = pgTable(
  'explore_memories_cars',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    identity: text('identity').notNull(),
    versionTag: text('version_tag').notNull(),
    make: text('make').notNull(),
    model: text('model').notNull(),
    year: integer('year').notNull(),
    color: text('color').notNull(),
    priceUsd: integer('price_usd').notNull(),
    mileageKm: integer('mileage_km').notNull(),
    fuelType: text('fuel_type').notNull(),
    transmission: text('transmission').notNull(),
    bodyStyle: text('body_style').notNull(),
    horsepower: integer('horsepower').notNull(),
    fencyMemoryId: text('fency_memory_id'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('explore_memories_cars_user_identity_tag_idx').on(
      table.userId,
      table.identity,
      table.versionTag,
    ),
  ],
)
