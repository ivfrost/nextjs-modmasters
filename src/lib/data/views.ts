import redis from '@/cache';

const keyFor = (id: number) => `pageviews:mod${id}`;

export async function incrementPageView(modId: number): Promise<number> {
	const modKey = keyFor(modId);
	const newVal = await redis.incr(modKey);
	return +newVal;
}
