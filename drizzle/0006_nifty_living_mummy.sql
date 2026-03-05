ALTER TABLE "addon_comments" DROP CONSTRAINT IF EXISTS "addon_comments_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "addons" DROP CONSTRAINT IF EXISTS "addons_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "mod_comments" DROP CONSTRAINT IF EXISTS "mod_comments_author_id_usersSync_id_fk";--> statement-breakpoint
ALTER TABLE "mods" DROP CONSTRAINT IF EXISTS "mods_author_id_usersSync_id_fk";--> statement-breakpoint

ALTER TABLE "usersSync" ADD COLUMN "__new_id" integer;--> statement-breakpoint

WITH numbered AS (
	SELECT "id", row_number() OVER (ORDER BY "id") AS rn
	FROM "usersSync"
)
UPDATE "usersSync" u
SET "__new_id" = n.rn
FROM numbered n
WHERE u."id" = n."id";--> statement-breakpoint

UPDATE "mods" m
SET "author_id" = u."__new_id"::text
FROM "usersSync" u
WHERE m."author_id" = u."id";--> statement-breakpoint

UPDATE "addons" a
SET "author_id" = u."__new_id"::text
FROM "usersSync" u
WHERE a."author_id" = u."id";--> statement-breakpoint

UPDATE "mod_comments" mc
SET "author_id" = u."__new_id"::text
FROM "usersSync" u
WHERE mc."author_id" = u."id";--> statement-breakpoint

UPDATE "addon_comments" ac
SET "author_id" = u."__new_id"::text
FROM "usersSync" u
WHERE ac."author_id" = u."id";--> statement-breakpoint

ALTER TABLE "addon_comments" ALTER COLUMN "author_id" SET DATA TYPE integer USING "author_id"::integer;--> statement-breakpoint
ALTER TABLE "addons" ALTER COLUMN "author_id" SET DATA TYPE integer USING "author_id"::integer;--> statement-breakpoint
ALTER TABLE "mod_comments" ALTER COLUMN "author_id" SET DATA TYPE integer USING "author_id"::integer;--> statement-breakpoint
ALTER TABLE "mods" ALTER COLUMN "author_id" SET DATA TYPE integer USING "author_id"::integer;--> statement-breakpoint

ALTER TABLE "usersSync" ALTER COLUMN "id" SET DATA TYPE integer USING "__new_id";--> statement-breakpoint
ALTER TABLE "usersSync" DROP COLUMN "__new_id";--> statement-breakpoint

ALTER TABLE "addon_comments" ADD CONSTRAINT "addon_comments_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addons" ADD CONSTRAINT "addons_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mod_comments" ADD CONSTRAINT "mod_comments_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mods" ADD CONSTRAINT "mods_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;