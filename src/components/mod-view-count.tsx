import { Eye } from 'lucide-react';

export function ModViewCount({ viewCount }: { viewCount: number }) {
  return (
    <div className="flex items-center text-sm text-muted-foreground gap-1">
      <Eye className="h-4 w-4" />
      {viewCount ? <span>{viewCount}</span> : <span>—</span>}
      <span>views</span>
    </div>
  );
}
