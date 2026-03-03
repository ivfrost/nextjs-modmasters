ALTER TABLE "addon_comment" RENAME TO "addon_comments";--> statement-breakpoint
ALTER TABLE "mod_comment" RENAME TO "mod_comments";--> statement-breakpoint
ALTER TABLE "addon_comments" DROP CONSTRAINT "addon_comment_author_id_usersSync_id_fk";
--> statement-breakpoint
ALTER TABLE "addon_comments" DROP CONSTRAINT "addon_comment_addon_id_addons_id_fk";
--> statement-breakpoint
ALTER TABLE "mod_comments" DROP CONSTRAINT "mod_comment_author_id_usersSync_id_fk";
--> statement-breakpoint
ALTER TABLE "mod_comments" DROP CONSTRAINT "mod_comment_mod_id_mods_id_fk";
--> statement-breakpoint
ALTER TABLE "addon_comments" ADD CONSTRAINT "addon_comments_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addon_comments" ADD CONSTRAINT "addon_comments_addon_id_addons_id_fk" FOREIGN KEY ("addon_id") REFERENCES "public"."addons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mod_comments" ADD CONSTRAINT "mod_comments_author_id_usersSync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."usersSync"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mod_comments" ADD CONSTRAINT "mod_comments_mod_id_mods_id_fk" FOREIGN KEY ("mod_id") REFERENCES "public"."mods"("id") ON DELETE no action ON UPDATE no action;