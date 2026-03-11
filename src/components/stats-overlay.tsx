import { ArrowDownToLine, MessageCircle } from 'lucide-react';

type StatsOverlayProps = {
	comments: number;
	downloads: number;
};

export default function StatsOverlay(props: StatsOverlayProps) {
	const { comments, downloads } = props;

	return (
		<div className="absolute overflow-hidden bottom-1 gap-1 right-1 z-10 flex items-center text-xs dark:text-secondary-foreground text-white">
			{comments !== undefined ?
				<div
					className="flex items-center rounded-xl backdrop-blur-sm supports-backdrop-filter:bg-stone-950/60
		 bg-neutral-800 px-2 py-1">
					<MessageCircle strokeWidth={2.5} className="w-3 h-3 mr-1.75 -mt-px" />
					<span>{comments}</span>
				</div>
			:	''}
			{downloads !== undefined ?
				<div className="flex items-center rounded-xl backdrop-blur-sm supports-backdrop-filter:bg-stone-950/60 bg-neutral px-2 py-1">
					<ArrowDownToLine className="w-3.75 h-3.75 mr-1" />
					<span>{downloads}</span>
				</div>
			:	''}
		</div>
	);
}
