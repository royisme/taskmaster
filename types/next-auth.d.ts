// types/next-auth.d.ts
import type { DefaultSession } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { User as PrismaUser } from "@prisma/client"

// 基础用户属性接口
interface UserProperties {
  id: string
  studentNumber?: string | null
  schoolId?: string | null
  programName?: string | null
}

declare module "next-auth" {
  interface Session {
    user: UserProperties & DefaultSession["user"]
  }

  // 继承 Prisma 的 User 类型
  interface User extends UserProperties, Omit<PrismaUser, keyof UserProperties | "emailVerified"> {}
}

declare module "next-auth/jwt" {
  interface JWT extends UserProperties {}
}