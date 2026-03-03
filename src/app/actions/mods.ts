'use server';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type z from 'zod';
import { id } from 'zod/v4/locales';
import db from '@/db';
import { mods } from '@/db/schema';
import { auth } from '@/lib/auth/server';
import { BaseModSchema } from '@/types/schemas';

export type CreateModRequest = z.infer<typeof BaseModSchema>;

export const UpdateModRequestSchema = BaseModSchema.partial();

export type UpdateModRequest = z.infer<typeof UpdateModRequestSchema>;

export async function createMod(data: CreateModRequest) {
	const { data: session } = await auth.getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	console.log('✨ createMod called with data:', data);

	try {
		await db.insert(mods).values({
			title: data.title,
			slug: `${data.title}-${uuidv4()}`,
			content: data.content,
			published: true,
			downloads: 0,
			comments: 0,
		});
	} catch (e) {
		console.error('insert issue', e);
		// send to observability platform
	}
	return { succes: true, message: 'Mod created successfully' };
}

export async function updateMod(data: UpdateModRequest) {
	const { data: session } = await auth.getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	console.log('⬆️ updateMod called', session.user.id, data);
	try {
		await db
			.update(mods)
			.set({
				title: data.title,
				content: data.content,
			})
			.where(eq(mods.id, Number(id)));
	} catch (e) {
		console.error('insert issue', e);
		// send to observability platform
	}
	return { succes: true, message: 'Mod updated successfully' };
}

export async function deleteMod(id: string) {
	const { data: session } = await auth.getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	console.log('❌ deleteMod called', session.user.id, id);
	try {
		await db.delete(mods).where(eq(mods.id, Number(id)));
	} catch (e) {
		console.error('delete issue', e);
		// send to observability platform
	}
	return { succes: true, message: 'Mod deleted successfully' };
}

export const deleteModForm = async (formData: FormData) => {
	const id = formData.get('id');
	if (typeof id !== 'string') {
		throw new Error('Invalid ID');
	}
	return await deleteMod(id);
};
