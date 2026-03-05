export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <main className="container p-4 md:p-6">{children}</main>;
}
