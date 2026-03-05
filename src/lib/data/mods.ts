import { eq } from 'drizzle-orm';
import redis from '@/cache';
import db from '@/db/index';
import { mods } from '@/db/schema';

export async function getMods() {
	const cached = await redis.get('mods:all');
	if (cached) {
		console.log('🟢 Get mods cache hit');
		return cached;
	}
	console.log('🟡 Get mods cache miss');

	const response = await db
		.select({
			id: mods.id,
			title: mods.title,
			slug: mods.slug,
			category: mods.category,
			content: mods.content,
			downloads: mods.downloads,
			comments: mods.comments,
			imageUrl: mods.imageUrl,
			published: mods.published,
			releaseDate: mods.releaseDate,
			createdAt: mods.createdAt,
			updatedAt: mods.updatedAt,
		})
		.from(mods);

	redis.set('mods:all', response, {
		ex: 60,
	});

	return response.map((mod) => ({
		...mod,
		category: mod.category ?? undefined,
		imageUrl: mod.imageUrl ?? undefined,
	}));
}

export async function getModBySlug(slug: string) {
	const response = await db
		.select({
			id: mods.id,
			title: mods.title,
			slug: mods.slug,
			category: mods.category,
			content: mods.content,
			downloads: mods.downloads,
			comments: mods.comments,
			authorId: mods.authorId,
			imageUrl: mods.imageUrl,
			published: mods.published,
			releaseDate: mods.releaseDate,
			createdAt: mods.createdAt,
			updatedAt: mods.updatedAt,
		})
		.from(mods)
		.where(eq(mods.slug, slug));

	return response.length > 0 ?
			{
				...response[0],
				category: response[0].category ?? undefined,
				imageUrl: response[0].imageUrl ?? undefined,
			}
		:	null;
}
