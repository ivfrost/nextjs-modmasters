import ModEditor from '@/components/mod-editor';
import { authorizeModEdit } from '@/db/authz';
import { auth } from '@/lib/auth/server';
import { getModBySlug } from '@/lib/data/mods';

interface EditArticlePageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function EditArticlePage({
	params,
}: EditArticlePageProps) {
	const { data: session } = await auth.getSession();
	const { slug } = await params;
	const mod = await getModBySlug(slug);

	if (!session) {
		return <div>You must be signed in to edit this mod.</div>;
	}
	if (!mod) {
		return <div>Mod not found.</div>;
	}

	const isAuthorized = await authorizeModEdit(mod.id, session.user.id);
	if (!isAuthorized) {
		return <div>You are not authorized to edit this mod.</div>;
	}

	return (
		<ModEditor
			initialTitle={mod.title}
			initialContent={mod.content}
			initialImageUrl={mod.imageUrl ?? ''}
			isEditing={true}
			modId={mod.id}
			slug={mod.slug}
		/>
	);
}
