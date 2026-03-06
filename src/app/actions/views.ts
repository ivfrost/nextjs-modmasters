import redis from '@/cache';
import sendCelebrationEmail from '@/email/celebration-email';

const milestones = [10, 50, 100, 10000];

const keyFor = (id: number) => `pageviews:mod${id}`;

export async function incrementPageView(modId: number): Promise<number> {
  const modKey = keyFor(modId);
  const newVal = await redis.incr(modKey);

  if (milestones.includes(newVal)) {
    sendCelebrationEmail(modId, newVal);
  }

  return newVal;
}
