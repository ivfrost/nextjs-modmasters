import { SignedIn } from '@neondatabase/auth/react';
import ModEditor from '@/components/mod-editor';
import { auth } from '@/lib/auth/server';

interface EditArticlePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EditArticlePage({
	params,
}: EditArticlePageProps) {
	const { id } = await params;
	const { data: session } = await auth.getSession();

	// In a real app, you would fetch the article data here
	// For now, we'll just show some mock data if it's not "new"
	const mockData =
		id !== 'new' ?
			{
				title: `Sample Article ${id}`,
				content: `# Sample Article ${id}

This is some sample markdown content for article ${id}.

## Features
- **Bold text**
- *Italic text*
- [Links](https://example.com)

## Code Example
\`\`\`javascript
console.log("Hello from article ${id}");
\`\`\`

This would normally be fetched from your API.`,
			}
		:	{};

	if (!session) {
		return (
			<div className="container p-4 md:p-6">
				<p className="text-center text-lg text-gray-500">
					You must be signed in to edit a wiki article.
				</p>
			</div>
		);
	}

	return (
		<SignedIn>
			<ModEditor
				initialTitle={mockData.title}
				initialContent={mockData.content}
				isEditing={true}
				articleId={id}
			/>
		</SignedIn>
	);
}
