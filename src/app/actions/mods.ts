'use server';
import { eq } from 'drizzle-orm';
import db from '@/db';
import { mods } from '@/db/schema';
import { auth } from '@/lib/auth/server';
import {
	type CreateModRequest,
	type UpdateModRequest,
	UpdateModRequestSchema,
} from '@/types/api';
import { slugify } from '@/utils/slugify';

export interface UpdateModActionState {
	success: boolean;
	message: string;
	redirectTo?: string;
}

export async function createMod(data: CreateModRequest) {
	const { data: session } = await auth.getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	console.log('✨ createMod called with data:', data);

	try {
		await db.insert(mods).values({
			title: data.title,
			slug: slugify(data.title),
			authorId: session.user.id,
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

export async function updateMod(
	_prevState: UpdateModActionState,
	formData: FormData,
): Promise<UpdateModActionState> {
	const { data: session } = await auth.getSession();
	if (!session) {
		return { success: false, message: 'Unauthorized' };
	}

	let mod: UpdateModRequest;
	try {
		const plainObject = Object.fromEntries(formData.entries());
		mod = UpdateModRequestSchema.parse(plainObject);
	} catch {
		return { success: false, message: 'Invalid form data' };
	}

	console.log('⬆️ updateMod called', session.user.id, mod);
	try {
		await db
			.update(mods)
			.set({
				title: mod.title,
				content: mod.content,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(mods.id, Number(mod.id)));
	} catch (e) {
		console.error('update issue', e);
		// send to observability platform
		return { success: false, message: 'Failed to update mod' };
	}

	return {
		success: true,
		message: 'Mod updated successfully',
		redirectTo: `/mod/${mod.slug}`,
	};
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

export async function deleteModForm(formData: FormData) {
	const id = formData.get('id');
	if (typeof id !== 'string') {
		throw new Error('Invalid ID');
	}
	await deleteMod(id);
}
