import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';

const mods = pgTable('mods', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	content: text('content').notNull(),
	downloads: integer('downloads').default(0).notNull(),
	comments: integer('comments').default(0).notNull(),
	status: text('status').default('pending').notNull(),
	imageUrl: text('image_url'),
	published: boolean('published').default(false).notNull(),
	authorId: text('author_id')
		.notNull()
		.references(() => usersSync.id),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	content: text('content').notNull(),
	authorId: text('author_id')
		.notNull()
		.references(() => usersSync.id),
	modId: integer('mod_id')
		.notNull()
		.references(() => mods.id),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

const schema = { mods, comments };
export { mods, comments };
export default schema;

export type Mod = typeof mods.$inferSelect;
export type NewMod = typeof mods.$inferInsert;

export const usersSync = pgTable('usersSync', {
	id: text('id').primaryKey(), // Stack Auth user ID
	name: text('name'),
	email: text('email'),
});
export type User = typeof usersSync.$inferSelect;
