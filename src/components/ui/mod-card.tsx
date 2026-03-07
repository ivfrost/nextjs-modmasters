import {
	ArrowDownToLine,
	ArrowRight,
	Calendar,
	MessageCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import type { ModCardProps } from '@/types/schemas';
import { getTimeSince } from '@/utils/time';

export function ModCard(props: ModCardProps) {
	const {
		title,
		content,
		summary,
		category,
		updatedAt,
		imageUrl,
		downloads,
		comments,
		href,
	} = props;

	return (
		<Card className="relative w-full flex flex-col lg:flex-row gap-3 lg:gap-6 p-6 lg:h-full group lg:px-6">
			<div className="relative min-h-26 aspect-square rounded-lg shadow-sm shrink-0 overflow-hidden -mx-2 -mt-2 lg:mr-0 lg:-mb-2">
				{/* Main image */}
				{imageUrl ?
					<Image
						src={imageUrl}
						unoptimized={true}
						alt={title}
						fill
						className="object-cover"
					/>
				:	<Image
						src="https://placehold.co/400x225?text=No+Image"
						unoptimized={true}
						alt="No image available"
						fill
						className="object-cover"
					/>
				}
				{/* Dark overlay */}
				<div className="absolute inset-0 bg-linear-to-br from-neutral-800/20 to-black/50 z-20" />
				{/* Stats overlay */}
				<div className="absolute overflow-hidden bottom-1 gap-1 right-1 z-50 flex items-center text-xs dark:text-secondary-foreground text-white">
					<div
						className="flex items-center rounded-xl backdrop-blur-sm supports-backdrop-filter:bg-stone-950/60
		 bg-neutral-800 px-2 py-1">
						<MessageCircle
							strokeWidth={2.5}
							className="w-3 h-3 mr-1.75 -mt-px"
						/>
						<span>{comments}</span>
					</div>
					<div
						className="flex items-center rounded-xl backdrop-blur-sm supports-backdrop-filter:bg-stone-950/60
		 bg-neutral-800 px-2 py-1">
						<ArrowDownToLine className="w-3.75 h-3.75 mr-1" />
						<span>{downloads}</span>
					</div>
				</div>
			</div>
			<div className="flex flex-col space-y-4 w-full">
				<CardHeader className="flex justify-between px-0">
					{(href && (
						<Link href={href}>
							<CardTitle>{title}</CardTitle>
						</Link>
					)) || <CardTitle>{title}</CardTitle>}
					<div className="flex gap-2 items-center text-xs text-muted-foreground font-medium">
						<div className="flex items-center text-xs text-muted-foreground font-medium">
							<span className="-mb-0.5 whitespace-nowrap">
								{getTimeSince(updatedAt)}
							</span>
						</div>
					</div>
				</CardHeader>
				<CardContent className="text-sm lg:text-base lg:gap-4 p-0">
					<CardDescription className="line-clamp-3 text-xs lg:h-14 md:text-sm text-muted-foreground">
						{summary || content || 'No description available.'}
					</CardDescription>
				</CardContent>
				<CardFooter className="flex justify-between mt-auto items-center px-0 -mb-2">
					{category && <Badge variant="secondary">{category}</Badge>}
					{href && (
						<Link
							href={href}
							className="text-xs md:text-sm font-medium text-blue-500 underline shrink-0 flex items-center">
							Learn More
							<ArrowRight size={14} className="ml-1" />
						</Link>
					)}
				</CardFooter>
			</div>
		</Card>
	);
}
