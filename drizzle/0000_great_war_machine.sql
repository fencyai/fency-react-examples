CREATE TABLE "streaming_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fency_conversation_id" text NOT NULL,
	"title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "streaming_conversations_fency_conversation_id_unique" UNIQUE("fency_conversation_id")
);
--> statement-breakpoint
CREATE TABLE "streaming_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"fency_agent_task_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "structured_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fency_conversation_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "structured_conversations_fency_conversation_id_unique" UNIQUE("fency_conversation_id")
);
--> statement-breakpoint
CREATE TABLE "structured_extractions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"fency_agent_task_id" text,
	"input_text" text NOT NULL,
	"result" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "streaming_messages" ADD CONSTRAINT "streaming_messages_conversation_id_streaming_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."streaming_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "structured_extractions" ADD CONSTRAINT "structured_extractions_conversation_id_structured_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."structured_conversations"("id") ON DELETE cascade ON UPDATE no action;