import ModEditor from '@/components/mod-editor';
import { auth } from '@/lib/auth/server';

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  const { data: session } = await auth.getSession();
  const initialModData = {
    initialTitle: '',
    initialContent: '',
    initialImageUrl: '',
    initialCategory: '',
    isEditing: false,
  };

  if (!session) {
    return (
      <div className="container p-4 md:p-6">
        <p className="text-center text-lg text-gray-500">
          You must be signed in to create a mod.
        </p>
      </div>
    );
  }

  return <ModEditor {...initialModData} />;
}
