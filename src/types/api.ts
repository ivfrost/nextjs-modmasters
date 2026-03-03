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

export type CreateModRequest = z.infer<typeof BaseModSchema>;

export const UpdateModRequestSchema = BaseModSchema.partial().extend({
  id: z.coerce.number(),
  slug: z.string(),
});

export type UpdateModRequest = z.infer<typeof UpdateModRequestSchema>;
