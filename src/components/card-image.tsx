import Image from 'next/image';

export default function CardImage({
	imageUrl,
	children,
}: {
	imageUrl?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="relative h-full lg:w-auto w-full aspect-square rounded-md overflow-hidden">
			{imageUrl ?
				<Image
					src={imageUrl}
					alt="Mod Image"
					fill
					className="object-cover object-center"
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
			<div className="absolute inset-0 bg-linear-to-br from-neutral-800/10 to-black/30 z-20" />
			{children}
		</div>
	);
}
