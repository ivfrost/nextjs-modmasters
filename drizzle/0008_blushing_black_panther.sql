ALTER TABLE "addon_comments" DROP CONSTRAINT IF EXISTS "addon_comments_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "addons" DROP CONSTRAINT IF EXISTS "addons_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "mod_comments" DROP CONSTRAINT IF EXISTS "mod_comments_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "mods" DROP CONSTRAINT IF EXISTS "mods_author_id_usersSync_id_fk";--> statement-breakpoint

ALTER TABLE "usersSync" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "mods" ALTER COLUMN "author_id" SET DATA TYPE text USING "author_id"::text;--> statement-breakpoint
ALTER TABLE "mod_comments" ALTER COLUMN "author_id" SET DATA TYPE text USING "author_id"::text;--> statement-breakpoint
ALTER TABLE "addon_comments" ALTER COLUMN "author_id" SET DATA TYPE text USING "author_id"::text;--> statement-breakpoint
ALTER TABLE "addons" ALTER COLUMN "author_id" SET DATA TYPE text USING "author_id"::text;--> statement-breakpoint

ALTER TABLE "addon_comments" ADD CONSTRAINT "addon_comments_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addons" ADD CONSTRAINT "addons_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mod_comments" ADD CONSTRAINT "mod_comments_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mods" ADD CONSTRAINT "mods_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint