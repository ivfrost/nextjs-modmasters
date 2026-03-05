'use client';

import MDEditor from '@uiw/react-md-editor';
import { Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { type UpdateModActionState, updateMod } from '@/app/actions/mods';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InputChangeHandler } from '@/types/react';

const ModEditorPropSchema = z.object({
	initialTitle: z.string().optional(),
	initialContent: z.string().optional(),
	initialImageUrl: z.string().optional(),
	isEditing: z.boolean().default(false),
	modId: z.number(),
	slug: z.string(),
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
		isEditing = false,
		modId,
		slug,
	} = props;
	const router = useRouter();
	const [title, setTitle] = useState(initialTitle);
	const [content, setContent] = useState(initialContent);
	const [files, setFiles] = useState<File[]>([]);
	const [errors, setErrors] = useState<FormErrors>({});

	const initialActionState: UpdateModActionState = {
		success: false,
		message: '',
	};
	const [actionState, formAction, isSubmitting] = useActionState(
		updateMod,
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

		toast.error(actionState.message);
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
	const removeFile = (index: number) => {
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

	const pageTitle = isEditing ? 'Edit mod' : 'Create new mod';

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="mb-4">
				<h1 className="text-3xl font-bold">{pageTitle}</h1>
				{isEditing && modId && (
					<p className="text-muted-foreground mt-2">Editing mod: {title}</p>
				)}
			</div>

			<form action={formAction} className="space-y-6">
				<input type="hidden" name="slug" value={slug} />
				<input type="hidden" name="id" value={modId} />
				<input type="hidden" name="content" value={content} />
				<input type="hidden" name="existingImageUrl" value={initialImageUrl} />
				{/* Title Section */}
				<Card>
					<CardHeader>
						<CardTitle>Mod Title</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Label htmlFor="title">Title *</Label>
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

				{/* Content Section */}
				<Card>
					<CardHeader>
						<CardTitle>Mod description</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Label htmlFor="content">Description (Markdown) *</Label>
							<div
								className={`border rounded-md ${
									errors.content ? 'border-destructive' : ''
								}`}>
								<MDEditor
									value={content}
									onChange={(val) => setContent(val || '')}
									preview="edit"
									hideToolbar={false}
									visibleDragbar={false}
									textareaProps={{
										placeholder: 'Write your article content in Markdown...',
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
										className="cursor-pointer text-sm font-medium">
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

							{/* Display uploaded files */}
							{files.length > 0 && (
								<div className="space-y-2">
									<Label className="text-sm font-medium">Uploaded Files:</Label>
									<div className="space-y-2">
										{files.map((file, index) => (
											<div
												key={`${file.name}-${index}`}
												className="flex items-center justify-between p-2 px-3.75 bg-muted rounded-md">
												<div className="flex items-center gap-x-2">
													<span className="text-sm font-medium">
														{file.name}
													</span>
													<span className="text-xs text-muted-foreground">
														({(file.size / 1024).toFixed(1)} KB)
													</span>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeFile(index)}
													className="h-8 w-8 p-0">
													<X className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
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
								disabled={isSubmitting}>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="min-w-25">
								{isSubmitting ? 'Saving...' : 'Save Article'}
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}
