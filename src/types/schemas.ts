import z from 'zod';

export const BaseModSchema = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string().optional(),
  authorId: z.string(),
  imageUrl: z.string().optional(),
});

// Component props
export const ModCardPropSchema = BaseModSchema.extend({
  id: z.number(),
  href: z.string().optional(),
  rating: z.number().optional(),
  category: z.string().optional(),
  comments: z.number(),
  downloads: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ModCardProps = z.infer<typeof ModCardPropSchema>;
