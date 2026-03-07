import { ModCard } from '@/components/ui/mod-card';
import { getMods } from '@/lib/data/mods';

export default async function Home() {
	const mods = await getMods();
	const sortedMods = mods.slice().sort((a, b) => {
		const aDate = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
		const bDate = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
		return bDate - aDate;
	});
	return (
		<div className="flex flex-col gap-4 lg:gap-6">
			{sortedMods.map((mod) => (
				<ModCard
					summary={mod.summary ?? 'No summary'}
					key={mod.id}
					{...mod}
					href={`/mod/${mod.slug}`}
				/>
			))}
		</div>
	);
}
