CREATE TABLE "document_analysis_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"fency_memory_id" text NOT NULL,
	"file_name" text NOT NULL,
	"content_status" text NOT NULL,
	"content_parts" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "document_analysis_documents_fency_memory_id_unique" UNIQUE("fency_memory_id")
);
--> statement-breakpoint
CREATE TABLE "document_analysis_memory_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"fency_memory_type_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "document_analysis_memory_types_name_unique" UNIQUE("name"),
	CONSTRAINT "document_analysis_memory_types_fency_memory_type_id_unique" UNIQUE("fency_memory_type_id")
);
