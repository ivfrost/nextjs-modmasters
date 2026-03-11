import { CalendarIcon, Edit, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import z from 'zod';
import { deleteModForm } from '@/app/actions/mods';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ModCardPropSchema } from '@/types/schemas';
import { formatDate } from '@/utils/time';
import ButtonBack from './button-back';
import ModAuthor from './mod-author';
import { ModViewCount } from './mod-view-count';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from './ui/carousel';

const ModViewerSchema = ModCardPropSchema.extend({
	canEdit: z.boolean(),
	viewCount: z.number(),
});
type ModViewerProps = z.infer<typeof ModViewerSchema>;

export default function ModViewer(props: ModViewerProps) {
	const {
		id,
		title,
		content,
		category,
		authorId,
		createdAt,
		imageUrl,
		href,
		canEdit,
		viewCount,
	} = props;

	return (
		<div className="container mx-auto max-w-4xl space-y-4 lg:space-y-6">
			<div className="mb-6 flex gap-2 justify-between">
				<ButtonBack href="/" />
				{canEdit && href && (
					<div className="flex justify-end gap-x-2">
						{/* Edit Button - Only shown if user has edit permissions */}
						<div className="flex items-center gap-2">
							<Link href={href} className="cursor-pointer">
								<Button variant="outline" className="cursor-pointer">
									<Edit className="h-4 w-4 mr-2" />
									Edit Mod
								</Button>
							</Link>
						</div>
					</div>
				)}
			</div>

			<Carousel className="lg:mx-10 mx-12 max-w-sm lg:max-w-xl">
				<CarouselContent>
					{Array.from({ length: 5 }).map((_, index) => (
						<CarouselItem key={index} className="lg:basis-sm basis-full">
							<div className="p-1">
								<Card>
									<CardContent className="flex aspect-video items-center justify-center p-6">
										<span className="text-4xl font-semibold">{index + 1}</span>
									</CardContent>
								</Card>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
			<Card className="overflow-hidden">
				{/* Mod Header */}
				<CardHeader className="border-b border-border space-y-4 lg:space-y-6">
					<div className="flex justify-between items-start gap-1 flex-col">
						<div className="flex items-center flex-wrap gap-x-3 w-full">
							<span className="flex items-center">
								<h1 className="lg:text-3xl text-xl font-bold text-foreground space-x-2">
									{title}{' '}
								</h1>
							</span>
						</div>
					</div>
				</CardHeader>

				{/* Mod Content */}
				<CardContent className="text-sm lg:text-base lg:gap-4">
					{/* Rendered Markdown Content */}
					<div className="prose prose-stone dark:prose-invert max-w-none lg:p-2">
						<ReactMarkdown
							components={{
								// Customize heading styles
								h1: ({ children }) => (
									<h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
										{children}
									</h1>
								),
								h2: ({ children }) => (
									<h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
										{children}
									</h2>
								),
								h3: ({ children }) => (
									<h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">
										{children}
									</h3>
								),
								// Customize paragraph styles
								p: ({ children }) => (
									<p className="mb-4 text-foreground leading-6 lg:leading-7">
										{children}
									</p>
								),
								// Customize list styles
								ul: ({ children }) => (
									<ul className="mb-4 ml-6 list-disc text-foreground">
										{children}
									</ul>
								),
								ol: ({ children }) => (
									<ol className="mb-4 ml-6 list-decimal text-foreground">
										{children}
									</ol>
								),
								li: ({ children }) => (
									<li className="mb-1 text-foreground">{children}</li>
								),
								// Customize code styles
								code: ({ children, className }) => {
									const isInline = !className;
									return isInline ?
											<code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
												{children}
											</code>
										:	<code className={className}>{children}</code>;
								},
								pre: ({ children }) => (
									<pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
										{children}
									</pre>
								),
								// Customize blockquote styles
								blockquote: ({ children }) => (
									<blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4 text-muted-foreground">
										{children}
									</blockquote>
								),
								// Customize link styles
								a: ({ children, href }) => (
									<a
										href={href}
										className="text-primary hover:underline font-medium"
										target="_blank"
										rel="noopener noreferrer">
										{children}
									</a>
								),
								// Customize table styles
								table: ({ children }) => (
									<div className="overflow-x-auto mb-4">
										<table className="min-w-full border-collapse border border-border">
											{children}
										</table>
									</div>
								),
								th: ({ children }) => (
									<th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
										{children}
									</th>
								),
								td: ({ children }) => (
									<td className="border border-border px-4 py-2">{children}</td>
								),
							}}>
							{content}
						</ReactMarkdown>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
