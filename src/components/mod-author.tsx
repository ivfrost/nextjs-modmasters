import { User2Icon } from 'lucide-react';
import { getUsernameById } from '@/lib/data/users';

export default async function ModAuthor(props: { authorId: string }) {
  const { authorId } = props;
  const username = await getUsernameById(authorId);
  return (
    <div className="flex gap-1 items-center">
      <User2Icon size={14} />
      <span className="text-xs tracking-wide text-muted-foreground">by</span>
      <span className="text-sm text-foreground">{username}</span>
    </div>
  );
}
