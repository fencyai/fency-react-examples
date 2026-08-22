CREATE TABLE "explore_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fency_conversation_id" text NOT NULL,
	"title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "explore_conversations_fency_conversation_id_unique" UNIQUE("fency_conversation_id")
);
--> statement-breakpoint
CREATE TABLE "explore_queries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"query" text NOT NULL,
	"fency_agent_task_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "streaming_conversations" DROP CONSTRAINT "streaming_conversations_fency_conversation_id_unique";--> statement-breakpoint
ALTER TABLE "structured_conversations" DROP CONSTRAINT "structured_conversations_fency_conversation_id_unique";--> statement-breakpoint
ALTER TABLE "explore_queries" ADD CONSTRAINT "explore_queries_conversation_id_explore_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."explore_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "streaming_conversations" DROP COLUMN "fency_conversation_id";--> statement-breakpoint
ALTER TABLE "structured_conversations" DROP COLUMN "fency_conversation_id";