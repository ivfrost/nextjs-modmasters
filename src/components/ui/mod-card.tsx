import { StarIcon } from 'lucide-react';
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

export function ModCard(props: ModCardProps) {
	const {
		title,
		summary,
		author,
		category,
		updatedAt,
		imageUrl,
		rating,
		href,
	} = props;

	return (
		<Card className="relative w-full overflow-hidden hover:shadow-lg transition-shadow py-0">
			<div className="flex flex-row gap-4 p-4">
				<div className="relative w-64 aspect-video shrink-0 rounded-lg overflow-hidden">
					<Image
						src={imageUrl ?? 'https://placehold.co/300x200?text=No+Image'}
						unoptimized={true}
						alt={title}
						className="w-full h-full object-cover"
						width={320}
						height={180}
					/>
				</div>
				<div className="flex flex-col flex-1 gap-3">
					<div className="flex items-start justify-between gap-4">
						<Badge variant="outline">{category}</Badge>
						{rating && (
							<div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
								<StarIcon
									size={14}
									className="fill-yellow-400 stroke-yellow-400"
								/>
								<span>{rating}</span>
							</div>
						)}
					</div>
					<CardTitle className="text-md line-clamp-2">{title}</CardTitle>
					<CardDescription className="line-clamp-2 flex-1">
						{summary}
					</CardDescription>
					<div className="flex items-center justify-between mt-auto">
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<span className="font-medium text-sm">{author}</span>
							<span>•</span>
							<span>{updatedAt}</span>
						</div>
						<Link
							href={href}
							className="text-sm font-medium text-primary hover:underline shrink-0">
							View Details →
						</Link>
					</div>
				</div>
			</div>
		</Card>
	);
}
