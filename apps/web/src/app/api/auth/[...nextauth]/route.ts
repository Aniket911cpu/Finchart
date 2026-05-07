import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../../../../../../api/src/shared/prisma'; // Using shared prisma instance

export const authOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        // In a real app, verify passwordHash
        if (user && user.passwordHash === credentials.password) {
          return { id: user.id, email: user.email, name: user.name };
        }
        
        // Mock fallback for testing
        if (credentials.email === 'test@finchart.pro' && credentials.password === 'password') {
          return { id: 'test-id', email: 'test@finchart.pro', name: 'Test User' };
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
