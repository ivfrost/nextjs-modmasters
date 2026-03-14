import { expect, test, vi } from 'vitest';
import { createMod, type UpdateModActionState } from '@/app/actions/mods';
import redis from '@/cache';
import db from '@/db';
import type { UsersSync } from '@/db/schema';
import { mods } from '@/db/schema.migrations';
import { auth } from '@/lib/auth/server';

// Shared mock data
const testUser: UsersSync = {
  id: 'fa3421b2-1234-5678-90ab-cdef12345678',
  email: 'test@gmail.com',
  name: 'Test User',
  image: 'https://example.com/avatar.png',
};

const modData = {
  title: 'Test Mod',
  content: 'This is a test mod.',
  category: 'Gameplay',
};

const initialActionState: UpdateModActionState = {
  success: false,
  message: '',
};

const makeCreateModFormData = () => {
  const formData = new FormData();
  formData.set('title', modData.title);
  formData.set('content', modData.content);
  formData.set('category', modData.category);
  return formData;
};

test('logged in users can create mods', async () => {
  // Simulate an authenticated session
  vi.mocked(auth.getSession).mockResolvedValue({ data: { user: testUser } });

  // Mock the DB insert to prevent a real db write
  vi.spyOn(db, 'insert').mockReturnValue({
    values: vi.fn().mockResolvedValue(undefined),
  } as unknown as ReturnType<typeof db.insert>);

  // Redis and summarizeMod are mocked globally in test/setup.ts
  await createMod(initialActionState, makeCreateModFormData());

  // Verify DB insert was called on the mods table
  expect(db.insert).toHaveBeenCalledWith(mods);
});

test('unauthenticated users cannot create mods', async () => {
  // Simulate no active session
  vi.mocked(auth.getSession).mockResolvedValue({ data: null });

  vi.spyOn(db, 'insert').mockReturnValue({
    values: vi.fn().mockResolvedValue(undefined),
  } as unknown as ReturnType<typeof db.insert>);

  // createMod should throw before reaching the DB or cache
  await expect(
    createMod(initialActionState, makeCreateModFormData()),
  ).rejects.toThrow('Unauthorized');

  expect(db.insert).not.toHaveBeenCalled();
  expect(redis.del).not.toHaveBeenCalled();
});
