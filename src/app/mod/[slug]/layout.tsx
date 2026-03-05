import { SidebarPortal } from '@/components/sidebar/sidebar-portal';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

export default function ViewModLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <SidebarPortal>
        <Card className="p-4 mb-6">
          <CardTitle className="text-lg font-semibold mb-2">
            Viewing mod
          </CardTitle>
          <CardDescription>
            This is the mod details page. Rating 5/5
          </CardDescription>
        </Card>
      </SidebarPortal>
    </>
  );
}
