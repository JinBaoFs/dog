import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
import { authOptions } from '@/lib/authOptions';

export const handler = NextAuth(authOptions as never) as never;

// export default authOptions;

export { handler as GET, handler as POST };
