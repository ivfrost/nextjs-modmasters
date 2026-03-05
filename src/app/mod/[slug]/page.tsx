import ModViewer from '@/components/mod-viewer';
import { SidebarPortal } from '@/components/sidebar/sidebar-portal';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth/server';
import { getModBySlug } from '@/lib/data/mods';
import { incrementPageView } from '@/lib/data/views';

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
        <Card className="p-4 mb-6">
          <CardTitle className="text-lg font-semibold mb-2">
            Welcome to Modmasters!
          </CardTitle>
          <CardDescription>Rating: 5 / 5</CardDescription>
        </Card>
      </SidebarPortal>
    </>
  );
}
