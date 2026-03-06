import { incrementPageView } from '@/app/actions/views';
import ModViewer from '@/components/mod-viewer';
import { auth } from '@/lib/auth/server';
import { getModBySlug } from '@/lib/data/mods';

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
    <ModViewer
      {...mod}
      href={`/mod/edit/${mod.slug}`}
      canEdit={canEdit}
      viewCount={viewCount}
    />
  );
}
