'use client';
import { UserButton } from '@neondatabase/auth/react';
import Link from 'next/link';
import { useSession } from '@/lib/auth/client';
import { Button } from '../ui/button';

export function NavBar() {
  const { data } = useSession();
  const user = data?.user;

  return (
    <nav
      className="w-full border-b bg-white/80 backdrop-blur-2xl supports-backdrop-filter:bg-white/60 
		 dark:supports-backdrop-filter:bg-stone-950/80 sticky top-0 z-50"
    >
      <div className="container mx-auto flex h-18 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl tracking-tight">
            Modmasters
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <UserButton
              classNames={{
                trigger: {
                  base: 'bg-transparent border-none dark:text-neutral-100',
                },
              }}
              size="icon"
            />
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
