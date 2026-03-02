'use server';
import z from 'zod';
import { auth } from '@/lib/auth/server';
import { BaseModSchema } from '@/types/schemas';

export type CreateModRequest = z.infer<typeof BaseModSchema>;

export const UpdateModRequestSchema = BaseModSchema.omit({ authorId: true })
	.partial()
	.extend({
		id: z.string(),
	});
export type UpdateModRequest = z.infer<typeof UpdateModRequestSchema>;

export async function createMod(data: CreateModRequest) {
	const { data: session } = await auth.getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	console.log('✨ createMod called with data:', data);
	return { succes: true, message: 'Mod created successfully' };
}

export async function updateMod(data: UpdateModRequest) {
	const { data: session } = await auth.getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	console.log('⬆️ updateMod called', session.user.id, data);
	return { succes: true, message: 'Mod updated successfully' };
}

export async function deleteMod(id: string) {
	const { data: session } = await auth.getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	console.log('❌ deleteMod called', session.user.id, id);
	return { succes: true, message: 'Mod deleted successfully' };
}
