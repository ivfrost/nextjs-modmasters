'use client';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Nunito_Sans } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import { NavBar } from '@/components/nav/nav-bar';
import { AuthProvider } from '@/components/providers/auth-provider';

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
		/^\/auth(\/|$)/.test(pathname) || /^\/account(\/|$)/.test(pathname);

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${nunitoSans.variable} ${plexMono.variable} font-sans antialiased h-screen`}>
				<AuthProvider>
					<NavBar />
					<div
						className={`mx-auto w-full max-w-6xl pt-20 px-4 gap-10 ${!isAuthOrAccountPage ? 'flex flex-row' : ''}`}>
						<div className="block flex-2">{children}</div>
						{/* TODO: Turn aside into a portal */}
						{!isAuthOrAccountPage && (
							<aside className="flex-1">
								<div className="p-4 bg-muted rounded-md">
									<h2 className="text-lg font-semibold mb-2">
										Welcome to Modmasters!
									</h2>
									<p className="text-sm text-muted-foreground">
										Discover, create, and share mods for your favorite games.
										Join the community and unleash your creativity!
									</p>
								</div>
							</aside>
						)}
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
