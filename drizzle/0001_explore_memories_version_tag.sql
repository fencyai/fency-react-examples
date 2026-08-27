ALTER TABLE "explore_memories_cars" DROP CONSTRAINT "explore_memories_cars_identity_unique";--> statement-breakpoint
DROP INDEX "explore_memories_cars_user_identity_idx";--> statement-breakpoint
DELETE FROM "explore_memories_cars";--> statement-breakpoint
ALTER TABLE "explore_memories_cars" ADD COLUMN "version_tag" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "explore_memories_cars_user_identity_tag_idx" ON "explore_memories_cars" USING btree ("user_id","identity","version_tag");