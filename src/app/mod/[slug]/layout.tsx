export default function ViewModLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="gap-4 lg:gap-6">{children}</div>;
}
