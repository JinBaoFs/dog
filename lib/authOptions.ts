import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'login',
      credentials: {
        token: { label: 'token', type: 'text' },
        address: { label: 'address', type: 'text' }
      },
      authorize(credentials) {
        return credentials as any;
      }
    })
  ],
  callbacks: {
    async session({
      session,
      token
    }: {
      session: { user: { accessToken: string; address: string } };
      token: { accessToken: string; address: string };
    }) {
      session.user.accessToken = token.accessToken;
      session.user.address = token.address;
      return session;
    },
    jwt({
      token,
      user,
      account
    }: {
      account: { type: string };
      user: { token: string; address: string };
      token: { accessToken: string; address: string };
    }) {
      if (account?.type === 'credentials') {
        token.accessToken = user.token;
        token.address = user.address;
      }
      return token;
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    error: '/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};
