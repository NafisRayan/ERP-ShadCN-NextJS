'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';

export function useSession() {
  return useNextAuthSession();
}

export function useUser() {
  const { data: session } = useNextAuthSession();
  return session?.user;
}
