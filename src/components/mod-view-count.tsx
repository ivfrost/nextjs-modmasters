import { Eye } from 'lucide-react';

export function ModViewCount({ viewCount }: { viewCount: number }) {
	return (
		<div className="flex items-center text-sm text-muted-foreground gap-1">
			<Eye size={14} />
			{viewCount ?
				<span>{viewCount}</span>
			:	<span>—</span>}
			<span>views</span>
		</div>
	);
}
