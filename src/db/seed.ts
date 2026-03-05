import { promises } from 'node:fs';
import { eq } from 'drizzle-orm';
import db, { sql } from '@/db/index';
import { mods, usersSync } from '@/db/schema';
import { slugify } from '@/utils/slugify';

async function main() {
	try {
		const modsData = JSON.parse(
			await promises.readFile('./moddb-mods.json', 'utf-8'),
		);
		if (!Array.isArray(modsData) || modsData.length === 0) {
			throw new Error('ModDB data is empty or not an array');
		}
		console.log(`✅ Loaded ${modsData.length} mods from ModDB JSON file`);

		console.log('🧹 Truncating mods table and restarting identity...');
		await sql.query('TRUNCATE TABLE mods RESTART IDENTITY CASCADE;');

		console.log('🔎 Querying existing users...');
		const seedAuthorId = '42af8b62-d1af-4336-94c9-de0a0de8b6dc';
		const author = await db
			.select({ id: usersSync.id })
			.from(usersSync)
			.where(eq(usersSync.id, seedAuthorId));

		if (!author.length) {
			throw new Error(
				`Seed author not found in neon_auth.user for id: ${seedAuthorId}`,
			);
		}

		const authorId = author[0].id;
		const now = new Date().toISOString();

		// Prepare mods for insertion
		const modsToInsert = modsData.map((mod) => ({
			title: mod.title,
			slug: slugify(mod.title),
			content: mod.content,
			category: mod.category,
			downloads: 0,
			comments: 0,
			imageUrl: mod.imageUrl || null,
			published: true,
			authorId,
			releaseDate:
				mod.releaseDate ? new Date(mod.releaseDate).toISOString() : now,
			createdAt: now,
			updatedAt: now,
		}));

		// Insert mods
		await db.insert(mods).values(modsToInsert);
		console.log(`✅ Inserted ${modsToInsert.length} mods into the database\n`);

		// Optionally, sync the sequence if needed (for other tables)
	} catch (err) {
		console.error('💥 Seed failed:', err);
		process.exit(1);
	}
}

void main();
