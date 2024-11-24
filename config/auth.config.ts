// config/auth.config.ts
import NextAuth, { 
  Session, 
  User, 
  type AuthOptions, 
  Account, 
  Profile 
} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { Adapter } from "next-auth/adapters"
export const authConfig: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",    // 总是显示账户选择
          access_type: "offline",
          response_type: "code",
          access_token: undefined,     // 确保不使用缓存的 token
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
          createdAt: new Date(), // Add createdAt
          updatedAt: new Date(), // Add updatedAt
        }
      },
    }),

  ],
  callbacks: {  

    async signIn({ account, profile }) {
      if (account?.access_token) {
        account.access_token = undefined; // 清除可能缓存的 access token
      }
      return true;
    },
    async session({ session, token, user }) {  // 添加 token 参数
      if (session.user && token) {  // 检查 token 是否存在
        session.user.id = token.sub ?? token.id; // 使用 token 中的 id
        // 添加其他用户信息到 session
        session.user.studentNumber = token.studentNumber as string | null;
        session.user.schoolId = token.schoolId as string | null;
        session.user.programName = token.programName as string | null;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        // 从数据库获取额外的用户信息
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            studentNumber: true,
            schoolId: true,
            programName: true,
          },
        });
        
        if (dbUser) {
          token.studentNumber = dbUser.studentNumber;
          token.schoolId = dbUser.schoolId;
          token.programName = dbUser.programName;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
}