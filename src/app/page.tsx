import { ModCard } from '@/components/ui/mod-card';
import { auth } from '@/lib/auth/server';

export default function Home() {
	const sampleMods = [
		{
			title: 'AKM /AK47 Reanimation and Remodel',
			summary:
				'Replaces the AK-47 and AKM with a model that uses the model from Cod: Black Ops Cold War as base with parts...',
			category: 'Weapons',
			updatedAt: '3 days ago',
			author: 'SeDzhiMol',
			imageUrl:
				'https://media.moddb.com/cache/images/downloads/1/305/304912/thumb_620x2000/0222.gif',
			rating: 4.5,
			href: '/mod/1',
			id: '1',
		},
		{
			title: '[1.5.3][MCM] Inspect Weapons Expanded - v1.2',
			summary:
				'This mod expands the inspect weapons menu to include more weapons and provides additional information about each weapon.',
			category: 'Gameplay',
			updatedAt: '1 week ago',
			author: 'MadeUpModder',
			imageUrl:
				'https://media.moddb.com/images/downloads/1/306/305123/thumbnail.png',
			rating: 4.8,
			href: '/mod/2',
			id: '2',
		},
		{
			title: "SVT-40 n' AVT-40",
			summary:
				'This mod replaces the SVT-40 with the AVT-40, a variant of the SVT-40 that features a detachable magazine and improved ergonomics.',
			category: 'Weapons',
			updatedAt: '2 weeks ago',
			imageUrl:
				'https://media.moddb.com/cache/images/downloads/1/304/303984/thumb_620x2000/Background-SVT40.gif',
			rating: 3.9,
			author: 'AnotherModder',
			href: '/mod/3',
			id: '3',
		},
	];

	return (
		<div className="flex flex-col gap-6">
			{sampleMods.map((mod) => (
				<ModCard key={mod.id} {...mod} />
			))}
		</div>
	);
}
