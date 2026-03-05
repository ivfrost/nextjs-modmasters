'use server';
import { eq } from 'drizzle-orm';
import db from '@/db';
import { usersSync } from '@/db/schema';

export async function getUsernameById(id: string) {
	const response = await db
		.select({
			id: usersSync.id,
			name: usersSync.name,
			email: usersSync.email,
		})
		.from(usersSync)
		.where(eq(usersSync.id, id));

	return response[0]?.name ?? 'Unknown user';
}
