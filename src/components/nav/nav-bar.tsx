'use client';
import { UserButton } from '@neondatabase/auth/react';
import {
	ArrowDown,
	ArrowDown01Icon,
	Book,
	Bookmark,
	BookmarkPlusIcon,
	BookPlus,
	ChevronDown,
	PlusIcon,
	PlusSquareIcon,
} from 'lucide-react';
import Link from 'next/link';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from '@/lib/auth/client';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';

export function NavBar() {
	const { data } = useSession();
	const user = data?.user;

	return (
		<nav
			className="w-full border-b bg-white/80 backdrop-blur-2xl supports-backdrop-filter:bg-white/60 
		 dark:supports-backdrop-filter:bg-stone-950/80 sticky top-0 z-40">
			<div className="container mx-auto flex h-18 items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<Link href="/" className="font-bold text-xl tracking-tight">
						Modmasters
					</Link>
				</div>
				<div className="flex items-center gap-4">
					{user ?
						<>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										<PlusIcon />
										<ChevronDown />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="min-w-40">
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<Button
												asChild
												variant="ghost"
												className="w-full justify-start">
												<Link href="/mod/edit/new">
													<BookPlus className="me-2" />
													Create Mod
												</Link>
											</Button>
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuLabel>More</DropdownMenuLabel>
										<DropdownMenuItem>
											<Button
												asChild
												variant="ghost"
												className="w-full justify-start">
												<Link href="/my-mods">
													<Bookmark className="me-2" />
													My Mods
												</Link>
											</Button>
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
							<UserButton
								classNames={{
									trigger: {
										base: 'bg-transparent border-none dark:text-neutral-100',
									},
								}}
								size="icon"
							/>
						</>
					:	<>
							<Button asChild variant="outline">
								<Link href="/auth/sign-in">Sign In</Link>
							</Button>
							<Button asChild>
								<Link href="/auth/sign-up">Sign Up</Link>
							</Button>
						</>
					}
				</div>
			</div>
		</nav>
	);
}
