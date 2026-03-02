import z from 'zod';

export const BaseModSchema = z.object({
	title: z.string(),
	content: z.string(),
	category: z.string().optional(),
	imageUrl: z.string().optional(),
	authorId: z.string(),
});

// Component props
export const ModCardPropSchema = BaseModSchema.extend({
	id: z.number(),
	href: z.string().optional(),
	rating: z.number().optional(),
	comments: z.number().optional(),
	downloads: z.number().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type ModCardProps = z.infer<typeof ModCardPropSchema>;
