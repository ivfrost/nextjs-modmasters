import { SidebarPortal } from '@/components/sidebar/sidebar-portal';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

export default function EditModLayout({
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
            Editing mod
          </CardTitle>
          <CardDescription></CardDescription>
        </Card>
      </SidebarPortal>
    </>
  );
}
