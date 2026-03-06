import { pgSchema, text, uuid } from 'drizzle-orm/pg-core';

export * from './schema.migrations';

const neonAuth = pgSchema('neon_auth');

export const usersSync = neonAuth.table('user', {
	id: uuid('id').primaryKey(),
	email: text('email'),
	name: text('name'),
	image: text('image'),
});

export type UsersSync = typeof usersSync.$inferSelect;
