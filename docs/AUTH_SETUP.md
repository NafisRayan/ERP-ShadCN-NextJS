# Authentication Setup Guide

## Overview

The ERP system uses NextAuth.js v5 (Auth.js) for authentication with the following features:

- Email/password authentication with bcrypt hashing
- JWT-based sessions
- Role-based access control (admin, manager, employee, user)
- Organization-based multi-tenancy
- Protected routes with middleware

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here
NODE_ENV=development
```

To generate a secure `NEXTAUTH_SECRET`, run:

```bash
openssl rand -base64 32
```

### Database Setup

The authentication system requires MongoDB Atlas. Ensure your connection string is properly configured in `.env.local`.

## User Roles

The system supports four user roles:

1. **admin** - Full system access, can manage all settings
2. **manager** - Can manage team members and view reports
3. **employee** - Standard user with limited access
4. **user** - Basic access level

## Registration Flow

1. User fills out registration form with:
   - Personal information (name, email, password)
   - Organization information (name, email, phone)

2. System creates:
   - New Organization record
   - New User record with 'admin' role (first user of organization)

3. Password is hashed using bcrypt with 12 salt rounds

4. User is redirected to login page

## Login Flow

1. User enters email and password
2. Credentials are validated against database
3. Password is verified using bcrypt
4. JWT token is created with user info and role
5. Session is established
6. User is redirected to dashboard

## Protected Routes

The following routes are protected by authentication middleware:

- `/dashboard/*`
- `/inventory/*`
- `/crm/*`
- `/sales/*`
- `/purchases/*`
- `/finance/*`
- `/hr/*`
- `/projects/*`
- `/documents/*`
- `/reports/*`
- `/settings/*`

Unauthenticated users are redirected to `/login`.

## API Route Protection

To protect API routes, use the provided middleware helpers:

```typescript
import { withAuth, withRole } from '@/lib/middleware/auth';

// Require authentication
export const GET = withAuth(async (request, session) => {
  // Your handler code
  return NextResponse.json({ data: 'protected' });
});

// Require specific role
export const POST = withRole(['admin', 'manager'], async (request, session) => {
  // Your handler code
  return NextResponse.json({ data: 'admin only' });
});
```

## Client-Side Session Access

Use the provided hooks to access session data in client components:

```typescript
import { useSession, useUser } from '@/lib/hooks/useSession';

function MyComponent() {
  const { data: session, status } = useSession();
  const user = useUser();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return <div>Welcome, {user?.name}!</div>;
}
```

## Server-Side Session Access

Access session data in server components and API routes:

```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

## Security Features

1. **Password Hashing**: Bcrypt with 12 salt rounds
2. **JWT Sessions**: Secure token-based authentication
3. **Password Requirements**: Minimum 8 characters with mixed case and numbers
4. **Organization Isolation**: Users can only access their organization's data
5. **Role-Based Access**: Fine-grained permission control
6. **Secure Cookies**: HTTP-only cookies for session tokens
7. **CSRF Protection**: Built-in NextAuth.js protection

## Testing Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. You'll be redirected to `/login`

4. Click "create a new account" to register

5. Fill out the registration form

6. After registration, log in with your credentials

7. You'll be redirected to the dashboard

## Troubleshooting

### "NEXTAUTH_SECRET is not defined"

Make sure you have set `NEXTAUTH_SECRET` in your `.env.local` file.

### "MongoDB connection error"

Verify your `MONGODB_URI` is correct and your IP address is whitelisted in MongoDB Atlas.

### "Invalid email or password"

Check that:
- Email is registered in the database
- Password meets complexity requirements
- User account is active (`isActive: true`)

### Session not persisting

Ensure:
- `NEXTAUTH_URL` matches your application URL
- Cookies are enabled in your browser
- You're not in incognito/private mode

## Next Steps

After authentication is set up:

1. Implement role-based UI components
2. Add password reset functionality
3. Implement email verification
4. Add two-factor authentication (optional)
5. Set up audit logging for authentication events
