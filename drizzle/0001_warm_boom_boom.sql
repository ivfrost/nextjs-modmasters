CREATE TABLE "addons" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"comments" integer DEFAULT 0 NOT NULL,
	"image_url" text,
	"published" boolean DEFAULT false NOT NULL,
	"author_id" text NOT NULL,
	"mod_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "addons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "addon_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"addon_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mod_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"mod_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "comments" CASCADE;--> statement-breakpoint
ALTER TABLE "mods" DROP CONSTRAINT "mods_author_id_usersSync_id_fk";
--> statement-breakpoint
ALTER TABLE "mods" ADD COLUMN "release_date" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "addons" ADD CONSTRAINT "addons_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addons" ADD CONSTRAINT "addons_mod_id_mods_id_fk" FOREIGN KEY ("mod_id") REFERENCES "public"."mods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addon_comment" ADD CONSTRAINT "addon_comment_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addon_comment" ADD CONSTRAINT "addon_comment_addon_id_addons_id_fk" FOREIGN KEY ("addon_id") REFERENCES "public"."addons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mod_comment" ADD CONSTRAINT "mod_comment_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mod_comment" ADD CONSTRAINT "mod_comment_mod_id_mods_id_fk" FOREIGN KEY ("mod_id") REFERENCES "public"."mods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mods" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "mods" DROP COLUMN "author_id";