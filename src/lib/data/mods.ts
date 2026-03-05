import { eq } from 'drizzle-orm';
import redis from '@/cache';
import db from '@/db/index';
import { mods } from '@/db/schema';
import { type GetModsResponse, GetModsResponseSchema } from '@/types/api';

export async function getMods(): Promise<GetModsResponse> {
	const cached = await redis.get('mods:all');

	if (cached) {
		try {
			const parsedCached = GetModsResponseSchema.parse(cached);
			console.log('🟢 Get mods cache hit');
			return parsedCached;
		} catch (error) {
			console.log('🟡 Cache validation failed, fetching fresh data');
			throw new Error('Cache validation failed');
		}
	}
	console.log('🟡 Get mods cache miss');

	const modsData = await db
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
		.from(mods);

	const response = modsData.map((mod) => ({
		...mod,
		category: mod.category ?? undefined,
		imageUrl: mod.imageUrl ?? undefined,
	}));

	redis.set('mods:all', response, {
		ex: 60,
	});

	return response;
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
