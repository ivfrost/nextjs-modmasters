import { eq } from 'drizzle-orm';
import z from 'zod';
import db from '@/db';
import { mods } from '@/db/schema';

const AuthorizeModEditPropSchema = z.object({
	modId: z.number(),
	userId: z.string(),
});

export type AuthorizeModEditProps = z.infer<typeof AuthorizeModEditPropSchema>;

export const authorizeModEdit = async (modId: number, userId: string) => {
	const parsed = AuthorizeModEditPropSchema.parse({ modId, userId });

	const response = await db
		.select({
			authorId: mods.authorId,
		})
		.from(mods)
		.where(eq(mods.id, parsed.modId));
	if (!response.length) {
		return false;
	}
	return response[0].authorId === parsed.userId;
};
