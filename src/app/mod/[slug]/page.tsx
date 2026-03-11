import { Sparkle, Spotlight } from 'lucide-react';
import { incrementPageView } from '@/app/actions/views';
import ModViewer from '@/components/mod-viewer';
import { SidebarPortal } from '@/components/sidebar/sidebar-portal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from '@/components/ui/item';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { auth } from '@/lib/auth/server';
import { getModBySlug } from '@/lib/data/mods';
import { getUsernameById } from '@/lib/data/users';

interface ViewArticlePageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function ViewModPage({ params }: ViewArticlePageProps) {
	const { data: session } = await auth.getSession();
	const { slug } = await params;
	const mod = await getModBySlug(slug);

	if (!mod) {
		return <div>Article not found</div>;
	}

	// Mock permission check - users can edit if they're signed in
	// TODO: Implement real permission logic based on mod ownership or roles
	const canEdit = !!session;
	const viewCount = await incrementPageView(mod.id);

	return (
		<>
			<ModViewer
				{...mod}
				href={`/mod/edit/${mod.slug}`}
				canEdit={canEdit}
				viewCount={viewCount}
			/>

			<SidebarPortal>
				<div className="lg:space-y-6 space-y-4">
					<Card className="px-4">
						<CardHeader className="border-b border-neutral-600 -mx-4">
							<h2 className="text-lg font-bold">Metadata</h2>
						</CardHeader>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell className="font-medium">Category</TableCell>
									<TableCell>{mod.category || 'Uncategorized'}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Developer</TableCell>
									<TableCell>{getUsernameById(mod.authorId)}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Last update</TableCell>
									<TableCell>January 1, 2023</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Release date</TableCell>
									<TableCell>March 15, 2023</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Card>
					<Card className="px-4">
						<CardHeader className="border-b border-neutral-600 -mx-4">
							<h2 className="text-lg font-bold">Community Rating</h2>
						</CardHeader>
					</Card>
					<Card className="px-4">
						<CardHeader className="border-b border-neutral-600 -mx-4 flex items-center justify-between">
							<h2 className="text-lg font-bold">Popular addons</h2>
							<span className="text-sm font-semibold text-neutral-500">
								Top 5
							</span>
						</CardHeader>
						<ItemGroup className="flex flex-col gap-4">
							<Item className="relative flex flex-col">
								<ItemContent>
									<ItemTitle className="flex flex-col gap-4">
										<Badge
											variant="outline"
											className="ml-2 bg-green-100! text-green-800! border-green-300! dark:bg-green-900/20! dark:text-green-400! dark:border-green-700/50!">
											<Sparkle size={12} className="mr-1" />
											Most Popular
										</Badge>
										MCM Mod Configuration Menu
									</ItemTitle>
									<ItemDescription>
										Some description about Addon 1.
									</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Button variant="outline" size="sm">
										View Addon
									</Button>
								</ItemActions>
							</Item>
							<Item>Addon 2</Item>
							<Item>Addon 3</Item>
						</ItemGroup>
					</Card>
				</div>
			</SidebarPortal>
		</>
	);
}
