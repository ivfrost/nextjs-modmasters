import Image from 'next/image';

export default function EditModLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="max-w-2xl mx-auto">{children}</div>;
}
