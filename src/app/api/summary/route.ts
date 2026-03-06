import { eq, isNull } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import summarizeMod from '@/ai/summarize';
import redis from '@/cache';
import db from '@/db';
import { mods } from '@/db/schema.migrations';

export async function GET(req: NextRequest) {
  if (
    process.env.NODE_ENV !== 'development' &&
    req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db
    .select({ id: mods.id, title: mods.title, content: mods.content })
    .from(mods)
    .where(isNull(mods.summary));

  let updated = 0;
  console.log('🤖 Starting AI summary cron job');
  for (const row of rows) {
    try {
      const summary = await summarizeMod(row.title ?? '', row.content);
      if (!summary.trim()) {
        console.log(`⚠️ Skipping mod with id ${row.id} due to empty summary`);
        continue;
      }
      await db.update(mods).set({ summary }).where(eq(mods.id, row.id));
      console.log(`✅ Succesfuly summarized mod with id ${row.id}`);
      updated++;
    } catch (_) {
      console.error(`❌ Failed to summarize mod with id ${row.id}`);
    }
  }
  if (updated) {
    try {
      await redis.del('mods:all');
      console.log(
        `✅ Updated ${updated} mods with AI summaries and evicted cache`,
      );
    } catch (e) {
      console.error('❌ Failed to evict cache after updating summaries', e);
      return NextResponse.json(
        { error: 'Failed to evict mods:all cache' },
        { status: 500 },
      );
    }
  } else {
    console.log('ℹ️ No mods needed updating with AI summaries');
  }
  console.log('🤖 AI summary cron job completed');
  return NextResponse.json({ success: true, updated });
}
