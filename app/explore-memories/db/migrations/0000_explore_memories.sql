CREATE TABLE "explore_memories_cars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"identity" text NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"color" text NOT NULL,
	"price_usd" integer NOT NULL,
	"mileage_km" integer NOT NULL,
	"fuel_type" text NOT NULL,
	"transmission" text NOT NULL,
	"body_style" text NOT NULL,
	"horsepower" integer NOT NULL,
	"fency_memory_id" text,
	"updated_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "explore_memories_cars_identity_unique" UNIQUE("identity")
);
--> statement-breakpoint
CREATE TABLE "explore_memories_memory_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"fency_memory_type_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "explore_memories_memory_types_name_unique" UNIQUE("name"),
	CONSTRAINT "explore_memories_memory_types_fency_memory_type_id_unique" UNIQUE("fency_memory_type_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "explore_memories_cars_user_identity_idx" ON "explore_memories_cars" USING btree ("user_id","identity");