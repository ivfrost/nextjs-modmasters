ALTER TABLE "addon_comments" DROP CONSTRAINT IF EXISTS "addon_comments_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "addons" DROP CONSTRAINT IF EXISTS "addons_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "mod_comments" DROP CONSTRAINT IF EXISTS "mod_comments_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "mods" DROP CONSTRAINT IF EXISTS "mods_author_id_usersSync_id_fk";--> statement-breakpoint
DROP TABLE IF EXISTS "usersSync" CASCADE;--> statement-breakpoint
ALTER TABLE "addon_comments" ALTER COLUMN "author_id" SET DATA TYPE uuid USING "author_id"::uuid;--> statement-breakpoint
ALTER TABLE "addons" ALTER COLUMN "author_id" SET DATA TYPE uuid USING "author_id"::uuid;--> statement-breakpoint
ALTER TABLE "mod_comments" ALTER COLUMN "author_id" SET DATA TYPE uuid USING "author_id"::uuid;--> statement-breakpoint
ALTER TABLE "mods" ALTER COLUMN "author_id" SET DATA TYPE uuid USING "author_id"::uuid;