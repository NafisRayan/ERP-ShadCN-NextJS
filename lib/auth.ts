import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { loginSchema } from '@/lib/validations/auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          // Connect to database
          await connectDB();

          // Find user with password field
          const user = await User.findOne({ email, isActive: true })
            .select('+password')
            .lean();

          if (!user) {
            return null;
          }

          // Verify password
          const userDoc = await User.findById(user._id).select('+password');
          if (!userDoc) {
            return null;
          }

          const isPasswordValid = await userDoc.comparePassword(password);

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

          // Return user object
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            organizationId: user.organizationId.toString(),
            avatar: user.avatar,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string;
        session.user.avatar = token.avatar as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});
