import z from 'zod';
import { BaseModSchema } from './schemas';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface FileUploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  message?: string;
}

export const CreateModRequestSchema = BaseModSchema;

export type CreateModRequest = z.infer<typeof CreateModRequestSchema>;

export const GetModsResponseSchema = z.array(
  BaseModSchema.extend({
    id: z.number(),
    slug: z.string(),
    authorId: z.uuid(),
    summary: z.string().optional(),
    published: z.boolean(),
    downloads: z.number(),
    comments: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
);

export type GetModsResponse = z.infer<typeof GetModsResponseSchema>;

export const UpdateModRequestSchema = BaseModSchema.partial().extend({
  id: z.coerce.number(),
  slug: z.string(),
});

export type UpdateModRequest = z.infer<typeof UpdateModRequestSchema>;
