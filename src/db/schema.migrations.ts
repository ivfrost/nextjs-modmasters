import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

const mods = pgTable('mods', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  category: text('category'),
  downloads: integer('downloads').default(0).notNull(),
  comments: integer('comments').default(0).notNull(),
  rating: doublePrecision('rating'),
  imageUrl: text('image_url'),
  published: boolean('published').default(false).notNull(),
  releaseDate: timestamp('release_date', { mode: 'string' })
    .defaultNow()
    .notNull(),
  authorId: uuid('author_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

const addons = pgTable('addons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  category: text('category'),
  downloads: integer('downloads').default(0).notNull(),
  comments: integer('comments').default(0).notNull(),
  rating: doublePrecision('rating'),
  imageUrl: text('image_url'),
  published: boolean('published').default(false).notNull(),
  authorId: uuid('author_id').notNull(),
  modId: integer('mod_id')
    .notNull()
    .references(() => mods.id),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

const mod_comments = pgTable('mod_comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: uuid('author_id').notNull(),
  modId: integer('mod_id')
    .notNull()
    .references(() => mods.id),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

const addon_comments = pgTable('addon_comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: uuid('author_id').notNull(),
  addonId: integer('addon_id')
    .notNull()
    .references(() => addons.id),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

export { mods, addons, mod_comments, addon_comments };
