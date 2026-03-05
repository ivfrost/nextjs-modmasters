import { ArrowDownToLine, ArrowRight, MessageCircle } from 'lucide-react';
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
		category,
		updatedAt,
		imageUrl,
		downloads,
		comments,
		href,
	} = props;

	return (
		<Card className="relative w-full flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 py-4">
			<div className="relative h-32 lg:h-auto lg:w-45 shrink-0 rounded-md overflow-hidden shadow-sm before:absolute before:inset-0 before:z-10">
				{imageUrl ?
					<Image
						src={imageUrl}
						unoptimized={true}
						alt={title}
						fill
						className="h-full object-cover"
					/>
				:	<Image
						src="https://placehold.co/400x225?text=No+Image"
						unoptimized={true}
						alt="No image available"
						fill
						className="w-full h-full object-cover"
					/>
				}
			</div>
			<div className="space-y-2 w-full">
				<CardHeader className="space-y-2 p-0">
					<div className="flex w-full justify-between">
						{category && <Badge variant="outline">{category}</Badge>}
						<div className="flex items-center gap-2 pr-2">
							<div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
								<MessageCircle
									strokeWidth={2.2}
									size={11}
									className="stroke-neutral-400 mr-0.5"
								/>
								<span>{comments}</span>
							</div>
							<div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
								<ArrowDownToLine
									size={14}
									className="stroke-neutral-400 mr-0.5"
								/>
								<span>{downloads}</span>
							</div>
						</div>
					</div>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardDescription className="line-clamp-2 grow text-xs md:text-sm text-muted-foreground">
					{content}
				</CardDescription>
				<CardFooter className="flex items-center justify-between mt-auto pt-1 p-0">
					<div className="flex items-center gap-1 text-xs text-neutral-500">
						<span>{getTimeSince(updatedAt)}</span>
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
