'use client';
import { Analytics } from '@vercel/analytics/next';
import { IBM_Plex_Mono, Nunito_Sans } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import { NavBar } from '@/components/nav/nav-bar';
import { AuthProvider } from '@/components/providers/auth-provider';
import {
	SidebarPortalProvider,
	SidebarSlot,
} from '@/components/sidebar/sidebar-portal';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';

const nunitoSans = Nunito_Sans({
	variable: '--font-nunito-sans',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

const plexMono = IBM_Plex_Mono({
	variable: '--font-plex-mono',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const isAuthOrAccountPage =
		/^\/auth(\/|$)/.test(pathname) ||
		/^\/account(\/|$)/.test(pathname) ||
		/^\/mod\/edit(\/|$)/.test(pathname);

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${nunitoSans.variable} ${plexMono.variable} font-sans antialiased h-screen`}>
				<AuthProvider>
					<SidebarPortalProvider>
						<NavBar />
						<div
							className={`block mx-auto w-full max-w-5xl pt-20 px-4 space-y-4 lg:flex gap-4 lg:gap-6`}>
							<div className="block flex-7">{children}</div>
							{!isAuthOrAccountPage && (
								<aside className="flex-4">
									<SidebarSlot
										fallback={
											<Card className="p-4 mb-6">
												<CardTitle className="text-lg font-semibold mb-2">
													Welcome to Modmasters!
												</CardTitle>
												<CardDescription>
													Discover and share mods for your favorite games.
													Browse our collection, read reviews, and join the
													community of modders and gamers.
												</CardDescription>
											</Card>
										}
									/>
								</aside>
							)}
						</div>
					</SidebarPortalProvider>
					<Analytics />
				</AuthProvider>
				<Toaster />
			</body>
		</html>
	);
}
