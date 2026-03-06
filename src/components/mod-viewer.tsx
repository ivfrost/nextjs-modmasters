import { CalendarIcon, Edit, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import z from 'zod';
import { deleteModForm } from '@/app/actions/mods';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ModCardPropSchema } from '@/types/schemas';
import { formatDate } from '@/utils/time';
import ButtonBack from './button-back';
import ModAuthor from './mod-author';
import { ModViewCount } from './mod-view-count';

const ModViewerSchema = ModCardPropSchema.extend({
  canEdit: z.boolean(),
  viewCount: z.number(),
});
type ModViewerProps = z.infer<typeof ModViewerSchema>;

export default function ModViewer(props: ModViewerProps) {
  const {
    id,
    title,
    content,
    category,
    authorId,
    createdAt,
    imageUrl,
    href,
    canEdit,
    viewCount,
  } = props;

  return (
    <div className="container mx-auto max-w-4xl space-y-4 lg:space-y-6">
      <div className="mb-6 flex gap-2 justify-between">
        <ButtonBack href="/" />
        <div className="flex gap-2"></div>
      </div>
      {/* Mod Header */}
      <div className="flex justify-between items-start gap-1 mb-4 flex-col">
        <div className="flex items-center flex-wrap gap-x-3 w-full">
          <span className="flex items-center">
            <h1 className="text-3xl font-bold text-foreground space-x-2">
              {title}{' '}
              {category && (
                <Badge variant="secondary" className="align-middle">
                  {category}
                </Badge>
              )}
            </h1>
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between w-full text-sm text-muted-foreground gap-2">
          {/* Mod Metadata */}
          <div className="flex gap-2 items-center">
            <CalendarIcon size={13} />
            <span>{formatDate(createdAt)}</span>
            <span>⸱</span>
            <ModAuthor authorId={authorId} />
            <span>⸱</span>
            <ModViewCount viewCount={viewCount} />
          </div>
        </div>
      </div>

      {/* Mod Content */}
      <Card>
        <CardContent className="px-4 lg:px-6 text-sm lg:gap-4 ">
          {/* Mod Image - Display if exists */}
          {imageUrl && (
            <div className="mb-6">
              <div className="relative w-full lg:h-64 h-52 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={`Image for ${title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Rendered Markdown Content */}
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Customize heading styles
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">
                    {children}
                  </h3>
                ),
                // Customize paragraph styles
                p: ({ children }) => (
                  <p className="mb-4 text-foreground leading-7">{children}</p>
                ),
                // Customize list styles
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 list-disc text-foreground">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 list-decimal text-foreground">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="mb-1 text-foreground">{children}</li>
                ),
                // Customize code styles
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                    {children}
                  </pre>
                ),
                // Customize blockquote styles
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                // Customize link styles
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // Customize table styles
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2">{children}</td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-x-2">
            {/* Delete form calls the server action wrapper */}
            <form action={deleteModForm}>
              <input type="hidden" name="id" value={String(id)} />
              <Button
                type="submit"
                variant="destructive"
                className="cursor-pointer"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </form>
            {/* Edit Button - Only shown if user has edit permissions */}
            {canEdit && href && (
              <div className="flex items-center gap-2">
                <Link href={href} className="cursor-pointer">
                  <Button variant="outline" className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Mod
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
