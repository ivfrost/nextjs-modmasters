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
		<Card className="relative w-full flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 py-4 lg:h-full group">
			<div className="relative transition-transform lg:aspect-square lg:w-52 min-h-26 overflow-hidden rounded-lg shadow-sm">
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
						className="object-contain"
					/>
				}
			</div>
			<div className="space-y-2 w-full flex flex-col">
				<CardHeader className="space-y-2 p-0">
					<div className="flex w-full justify-between">
						{category && <Badge variant="outline">{category}</Badge>}
						<div className="flex items-center gap-3 text-xs font-medium text-neutral-500 pr-1.75">
							<div className="flex items-center">
								<MessageCircle
									strokeWidth={2.5}
									className="w-3 h-3 mr-1.5 -mt-px"
								/>
								<span>{comments}</span>
							</div>
							<div className="flex items-center">
								<ArrowDownToLine
									strokeWidth={2.25}
									className="w-3.5 h-3.5 mr-1.5"
								/>
								<span>{downloads}</span>
							</div>
						</div>
					</div>
					{(href && (
						<Link href={href}>
							<CardTitle>{title}</CardTitle>
						</Link>
					)) || <CardTitle>{title}</CardTitle>}
				</CardHeader>
				<CardDescription className="line-clamp-3 grow text-xs md:text-sm text-muted-foreground">
					{summary ?? content}
				</CardDescription>

				<CardFooter className="flex items-center justify-between mt-auto pt-1 p-0">
					<div className="flex items-center text-xs text-neutral-500 font-medium">
						<Calendar strokeWidth={2} className="w-3.5 h-3.5 mr-1.5" />
						<span className="-mb-0.5">{getTimeSince(updatedAt)}</span>
					</div>
					{href && (
						<Link
							href={href}
							className="text-xs md:text-sm font-medium text-blue-500 hover:underline shrink-0 flex items-center">
							Learn More
							<ArrowRight size={14} className="ml-1" />
						</Link>
					)}
				</CardFooter>
			</div>
		</Card>
	);
}
