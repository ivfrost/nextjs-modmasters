import { SignedIn } from '@neondatabase/auth/react';
import ModEditor from '@/components/mod-editor';
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
    return (
      <div className="container p-4 md:p-6">
        <p className="text-center text-lg text-gray-500">
          You must be signed in to edit a mod.
        </p>
      </div>
    );
  }

  return (
    <SignedIn>
      <ModEditor
        initialTitle={mod.title}
        initialContent={mod.content}
        isEditing={true}
        modId={mod.id}
        slug={mod.slug}
      />
    </SignedIn>
  );
}
