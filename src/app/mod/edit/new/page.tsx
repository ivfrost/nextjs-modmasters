import { SignedIn } from '@neondatabase/auth/react';
import ModEditor from '@/components/mod-editor';
import { auth } from '@/lib/auth/server';
import { getModBySlug } from '@/lib/data/mods';

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
	const { data: session } = await auth.getSession();

	if (!session) {
		return (
			<div className="container p-4 md:p-6">
				<p className="text-center text-lg text-gray-500">
					You must be signed in to create a new wiki article.
				</p>
			</div>
		);
	}
	return (
		<SignedIn>
			<ModEditor isEditing={false} />
		</SignedIn>
	);
}
