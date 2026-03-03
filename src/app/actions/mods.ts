'use server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import db from '@/db';
import { authorizeModEdit } from '@/db/authz';
import { mods } from '@/db/schema';
import { auth } from '@/lib/auth/server';
import {
  type CreateModRequest,
  type UpdateModRequest,
  UpdateModRequestSchema,
} from '@/types/api';
import { slugify } from '@/utils/slugify';

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

export async function updateMod(formData: FormData) {
  const { data: session } = await auth.getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const plainObject = Object.fromEntries(formData.entries());
  const mod: UpdateModRequest = UpdateModRequestSchema.parse(plainObject);

  if (!(await authorizeModEdit(mod.id, Number(session.user.id)))) {
    throw new Error('Forbidden');
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
    throw e;
  }

  redirect(`/mod/${mod.slug}`);
}

export async function deleteMod(id: string) {
  const { data: session } = await auth.getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  if (!(await authorizeModEdit(Number(id), Number(session.user.id)))) {
    throw new Error('Forbidden');
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
