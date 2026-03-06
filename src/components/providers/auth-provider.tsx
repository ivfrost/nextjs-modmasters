'use client';

import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      // biome-ignore lint/suspicious/noExplicitAny: NeonAuthUIProvider expects a specific internal type
      authClient={authClient as any}
      social={{ providers: ['google', 'github'] }}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={router.refresh}
      Link={Link}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
