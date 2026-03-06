import { SidebarPortal } from '@/components/sidebar/sidebar-portal';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

export default function ViewModLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="gap-4 lg:gap-6">
      {children}
      <SidebarPortal>
        <Card className="p-4">
          <CardTitle className="text-lg font-semibold mb-2">
            Welcome to Modmasters!
          </CardTitle>
          <CardDescription>Rating: 5 / 5</CardDescription>
        </Card>
      </SidebarPortal>
    </div>
  );
}
