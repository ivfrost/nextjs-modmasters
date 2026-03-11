'use server';
import { and, eq } from 'drizzle-orm';
import summarizeMod from '@/ai/summarize';
import redis from '@/cache';
import db from '@/db';
import { mods } from '@/db/schema';
import { auth } from '@/lib/auth/server';
import {
  type CreateModRequest,
  CreateModRequestSchema,
  type UpdateModRequest,
  UpdateModRequestSchema,
} from '@/types/api';
import { slugify } from '@/utils/slugify';
import { uploadFile } from './upload';

export interface UpdateModActionState {
  success: boolean;
  message: string;
  redirectTo?: string;
}

export async function createMod(
  _prevState: UpdateModActionState,
  formData: FormData,
): Promise<UpdateModActionState> {
  const { data: session } = await auth.getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  let mod: CreateModRequest;
  let imageUrl: string | undefined;
  let category: string | undefined;
  try {
    const firstFile = formData
      .getAll('files')
      .find((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!firstFile) {
      imageUrl = undefined;
    } else {
      const uploadFormData = new FormData();
      uploadFormData.append('files', firstFile);
      const uploaded = await uploadFile(uploadFormData);
      imageUrl = uploaded.url;
    }

    const categoryValue = formData.get('category');
    if (categoryValue !== null && typeof categoryValue !== 'string') {
      throw new Error('Invalid category');
    }
    category =
      typeof categoryValue === 'string' && categoryValue.length > 0
        ? categoryValue
        : undefined;

    mod = CreateModRequestSchema.parse({
      title: formData.get('title'),
      content: formData.get('content'),
      category,
      imageUrl,
      authorId: session.user.id,
    });
  } catch (e) {
    console.error('createMod parse/upload issue', e);
    return { success: false, message: 'Image upload failed' };
  }
  let summary: string | undefined;
  summary = await summarizeMod(mod.title, mod.content);
  console.log('✨ createMod called with data:', mod);
  try {
    await db.insert(mods).values({
      title: mod.title,
      slug: slugify(mod.title),
      content: mod.content,
      summary,
      imageUrl: mod.imageUrl,
      authorId: mod.authorId,
      releaseDate: new Date().toISOString(),
    });
  } catch (e) {
    console.error('insert issue', e);
    // send to observability platform
    return { success: false, message: 'Failed to create mod' };
  }

  redis.del('mods:all');
  return { success: true, message: 'Mod created successfully' };
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
  let imageUrl: string | undefined;
  try {
    mod = UpdateModRequestSchema.parse({
      id: formData.get('id'),
      slug: formData.get('slug'),
      title: formData.get('title'),
      content: formData.get('content'),
      imageUrl,
    });
  } catch (e) {
    console.error('updateMod parse/upload issue', e);
    return { success: false, message: 'Invalid form data' };
  }

  const isUserOwner = async () => {
    const result = await db
      .select({
        id: mods.id,
      })
      .from(mods)
      .where(
        and(eq(mods.authorId, session.user.id), eq(mods.id, Number(mod.id))),
      );
    return result.length > 0;
  };

  if (!(await isUserOwner())) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }

  const firstFile = formData
    .getAll('files')
    .find((entry): entry is File => entry instanceof File && entry.size > 0);

  if (!firstFile) {
    const existingImageUrl = formData.get('existingImageUrl');
    if (existingImageUrl !== null && typeof existingImageUrl !== 'string') {
      throw new Error('Invalid existing image URL');
    }
    imageUrl =
      typeof existingImageUrl === 'string' && existingImageUrl.length > 0
        ? existingImageUrl
        : undefined;
  } else {
    const uploadFormData = new FormData();
    uploadFormData.append('files', firstFile);
    const uploaded = await uploadFile(uploadFormData);
    imageUrl = uploaded.url;
  }

  const hasContentChanged = async () => {
    const result = await db
      .select({
        id: mods.id,
        content: mods.content,
      })
      .from(mods)
      .where(eq(mods.id, mod.id));
    if (!result.length) return false;
    return result[0].content !== mod.content;
  };

  let summary: string | undefined;
  console.log('⬆️ updateMod called', session.user.id, mod);
  if (await hasContentChanged()) {
    summary = await summarizeMod(mod.title || '', mod.content || '');
  }
  try {
    await db
      .update(mods)
      .set({
        title: mod.title,
        content: mod.content,
        summary: summary ?? undefined,
        imageUrl: mod.imageUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(mods.id, Number(mod.id)));
  } catch (e) {
    console.error('update issue', e);
    // send to observability platform
    return { success: false, message: 'Failed to update mod' };
  }

  redis.del('mods:all');
  return {
    success: true,
    message: 'Mod updated successfully',
    redirectTo: `/mod/${mod.slug}`,
  };
}

export async function deleteMod(id: number) {
  const { data: session } = await auth.getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  console.log('❌ deleteMod called', session.user.id, id);
  try {
    await db.delete(mods).where(eq(mods.id, id));
  } catch (e) {
    console.error('delete issue', e);
    // send to observability platform
  }

  redis.del('mods:all');
  return { success: true, message: 'Mod deleted successfully' };
}
