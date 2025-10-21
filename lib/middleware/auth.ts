import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role)) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  return session;
}

export function withAuth(
  handler: (request: Request, session: any) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      const session = await requireAuth();
      return handler(request, session);
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export function withRole(
  allowedRoles: string[],
  handler: (request: Request, session: any) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      const session = await requireRole(allowedRoles);
      return handler(request, session);
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      if (error.message.includes('Forbidden')) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
