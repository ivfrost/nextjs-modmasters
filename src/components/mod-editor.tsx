'use client';

import { PencilIcon, Sparkle, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import {
  createMod,
  type UpdateModActionState,
  updateMod,
} from '@/app/actions/mods';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InputChangeHandler } from '@/types/react';
import ButtonBack from './button-back';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

const ModEditorPropSchema = z.object({
  initialTitle: z.string().optional(),
  initialContent: z.string().optional(),
  initialImageUrl: z.string().optional(),
  initialCategory: z.string().optional(),
  isEditing: z.boolean().default(false),
  modId: z.number().optional(),
  slug: z.string().optional(),
});

type ModEditorProps = z.infer<typeof ModEditorPropSchema>;

interface FormErrors {
  title?: string;
  content?: string;
}

export default function ModEditor(props: ModEditorProps) {
  const {
    initialTitle = '',
    initialContent = '',
    initialImageUrl = '',
    initialCategory = '',
    isEditing = false,
    modId,
    slug,
  } = props;
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const initialActionState: UpdateModActionState = {
    success: false,
    message: '',
  };
  const [actionState, formAction, isSubmitting] = useActionState(
    isEditing ? updateMod : createMod,
    initialActionState,
  );

  useEffect(() => {
    if (!actionState.message) {
      return;
    }

    if (actionState.success) {
      toast.success(actionState.message, { position: 'top-center' });
      if (actionState.redirectTo) {
        router.push(actionState.redirectTo);
      }
      return;
    }

    toast.error(actionState.message, { position: 'top-center' });
  }, [actionState, router]);

  // Validate form
  const _validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file upload
  const handleFileUpload: InputChangeHandler = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Remove file
  const _removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle cancel
  const handleCancel = () => {
    const shouldLeave = window.confirm(
      'Are you sure you want to cancel? Any unsaved changes will be lost.',
    );
    if (shouldLeave) {
      router.push(`/mod/${slug}`);
    }
  };

  const pageTitle = isEditing
    ? `Editing mod: ${initialTitle}`
    : 'Create new mod';

  return (
    <div className="container mx-auto max-w-4xl space-y-4 lg:space-y-6">
      <div className="mb-6 flex gap-2 justify-between">
        <ButtonBack href={`/mod/${slug}`} />
      </div>
      {/* Dynamic header for create or edit */}
      <div className="flex items-center w-full">
        {isEditing ? (
          <>
            <PencilIcon className="h-6 w-6 me-2 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
          </>
        ) : (
          <>
            <Sparkle className="h-6 w-6 me-2 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
          </>
        )}
      </div>
      <form action={formAction} className="space-y-4 lg:space-y-6">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={modId} />
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="existingImageUrl" value={initialImageUrl} />
        {/* Title Section */}
        <Card>
          <CardHeader>
            <Label htmlFor="title">Title *</Label>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter mod title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Label htmlFor="category">Category *</Label>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                id="category"
                name="category"
                type="text"
                placeholder="Enter mod category..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>Mod description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div
                className={`border rounded-md ${
                  errors.content ? 'border-destructive' : ''
                }`}
              >
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  className="dark:bg-stone-950! bg-white! border-neutral-700/50! rounded-md! outline-1! dark:outline-neutral-800! outline-neutral-200! focus-within:outline-2!"
                  textareaProps={{
                    placeholder: 'Write your mod description in Markdown...',
                    style: { fontSize: 14, lineHeight: 1.5 },
                  }}
                />
              </div>
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <div className="space-y-2">
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer text-sm font-medium"
                  >
                    Click to upload files
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Upload images, documents, or other files to attach to your
                    article
                  </p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  name="files"
                  multiple
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </div>
              {/* Show uploaded files */}
              {files.length > 0 && (
                <ul className="mt-4 space-y-2 text-left">
                  {files.map((file, idx) => (
                    <li
                      key={`${file.name} + '-' + ${file.lastModified}`}
                      className="flex items-center gap-2"
                    >
                      <span className="truncate max-w-xs">{file.name}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => _removeFile(idx)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cover Image Section */}
        <Card>
          <CardContent>
            <CardTitle className="text-lg font-semibold mb-2">
              Cover Image
            </CardTitle>
            <CardDescription>
              <ul className="list-disc list-inside mb-4 text-sm text-muted-foreground">
                <li>Optimal dimensions: 400x400</li>
                <li>Formats: JPG, PNG</li>
                <li>Max size: 2MB</li>
              </ul>
              <Image
                src={initialImageUrl || '/placeholder-image.png'}
                alt="Cover Image Preview"
                width={400}
                height={225}
                className="rounded-md border"
              />
            </CardDescription>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-25"
              >
                {isSubmitting ? 'Saving...' : 'Save Article'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
