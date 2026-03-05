CREATE SEQUENCE IF NOT EXISTS "usersSync_id_seq";--> statement-breakpoint
ALTER TABLE "usersSync" ALTER COLUMN "id" SET DEFAULT nextval('"usersSync_id_seq"');--> statement-breakpoint
SELECT setval('"usersSync_id_seq"', COALESCE((SELECT MAX("id") FROM "usersSync"), 0) + 1, false);--> statement-breakpoint
ALTER TABLE "usersSync" ADD COLUMN "auth_user_id" text;--> statement-breakpoint
UPDATE "usersSync" SET "auth_user_id" = "id"::text WHERE "auth_user_id" IS NULL;--> statement-breakpoint
ALTER TABLE "usersSync" ALTER COLUMN "auth_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "usersSync" ADD CONSTRAINT "usersSync_auth_user_id_unique" UNIQUE("auth_user_id");