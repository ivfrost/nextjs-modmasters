'use client';
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import z from 'zod';
import { deleteMod } from '@/app/actions/mods';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTruncatedElement from '@/hooks/useTruncatedElement';
import { ModCardPropSchema } from '@/types/schemas';
import ButtonBack from './button-back';
import ButtonShowToggle from './button-show-toggle';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

const ModViewerSchema = ModCardPropSchema.extend({
  canEdit: z.boolean(),
  viewCount: z.number(),
});
type ModViewerProps = z.infer<typeof ModViewerSchema>;

export default function ModViewer(props: ModViewerProps) {
  const { id, title, content, href, canEdit } = props;
  const markdownRef = useRef(null);
  const { isTruncated, isReadingMore, setIsReadingMore } =
    useTruncatedElement(markdownRef);
  const router = useRouter();

  async function handleDeleteMod() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this mod?',
    );
    if (!confirmed) return;

    try {
      const result = await deleteMod(id);
      if (result.success) {
        toast.success('Mod deleted successfully', { position: 'top-center' });
        return new Promise((resolve) => {
          setTimeout(() => {
            router.push('/');
            resolve(true);
          }, 1500);
        });
      }
      toast.error(result.message, { position: 'top-center' });
    } catch (error) {
      toast.error('An error occurred while deleting the mod', {
        position: 'top-center',
      });
      console.error('Delete mod error:', error);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-4 lg:space-y-6">
      <div className="mb-6 flex gap-2 justify-between">
        <ButtonBack href="/" />
        {canEdit && href && (
          <>
            {/* Edit Button - Only shown if user has edit permissions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link
                      href={href}
                      className="cursor-pointer w-full items-center flex"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      <span>Edit mod</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    <button
                      type="button"
                      onClick={handleDeleteMod}
                      className="cursor-pointer w-full items-center flex"
                    >
                      <Trash className="h-4 w-4 mr-2 text-inherit" />
                      <span>Delete mod</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      <Carousel className="lg:mx-10 mx-12 max-w-sm lg:max-w-xl">
        <CarouselContent>
          {[
            { id: 'alpha', label: 1 },
            { id: 'bravo', label: 2 },
            { id: 'charlie', label: 3 },
            { id: 'delta', label: 4 },
            { id: 'echo', label: 5 },
          ].map((item) => (
            <CarouselItem key={item.id} className="lg:basis-sm basis-full">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{item.label}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Card className="relative overflow-hidden mb-0 pb-0">
        {/* Mod Header */}
        <CardHeader className="border-b border-border space-y-4 lg:space-y-6">
          <div className="flex justify-between items-start gap-1 flex-col">
            <div className="flex items-center flex-wrap gap-x-3 w-full">
              <span className="flex items-center">
                <h1 className="lg:text-3xl text-xl font-bold text-foreground space-x-2">
                  {title}{' '}
                </h1>
              </span>
            </div>
          </div>
        </CardHeader>

        {/* Mod Content */}
        <CardContent className="text-sm lg:text-base lg:gap-4">
          {/* Rendered Markdown Content */}
          <div
            ref={markdownRef}
            className={`prose prose-stone dark:prose-invert max-w-none transition-all duration-300 overflow-hidden wrap-break-word ${(!isReadingMore && 'line-clamp-7 mb-2') || 'mb-6'}`}
          >
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
                  <p className="mb-4 text-foreground leading-6 lg:leading-7">
                    {children}
                  </p>
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
          {isTruncated && (
            <ButtonShowToggle
              size="lg"
              variant="outline"
              className="absolute bottom-0 left-0 w-full"
              value={!!isReadingMore}
              onClick={() => setIsReadingMore(!isReadingMore)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
