ALTER TABLE "mods" DROP CONSTRAINT IF EXISTS "mods_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "addons" DROP CONSTRAINT IF EXISTS "addons_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "mod_comments" DROP CONSTRAINT IF EXISTS "mod_comments_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "addon_comments" DROP CONSTRAINT IF EXISTS "addon_comments_author_id_usersSync_id_fk";--> statement-breakpoint

ALTER TABLE IF EXISTS "mod_comment" DROP CONSTRAINT IF EXISTS "mod_comment_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE IF EXISTS "addon_comment" DROP CONSTRAINT IF EXISTS "addon_comment_author_id_usersSync_id_fk";--> statement-breakpoint

DROP TABLE IF EXISTS "usersSync" CASCADE;