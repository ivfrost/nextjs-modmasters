import { ModCard } from '@/components/ui/mod-card';
import { auth } from '@/lib/auth/server';
import { getMods } from '@/lib/data/mods';

export default async function Home() {
	const mods = await getMods();
	return (
		<div className="flex flex-col gap-6">
			{mods.map((mod) => (
				<ModCard key={mod.id} {...mod} href={`/mod/${mod.slug}`} />
			))}
		</div>
	);
}
