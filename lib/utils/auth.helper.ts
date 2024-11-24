// lib/utils/auth.helper.ts
import { getServerSession } from "next-auth/next"
import { authConfig } from "@/config/auth.config"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"

export async function getSession() {
  try {
    return await getServerSession(authConfig)
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSession()
    console.log("====auth.helper.ts====session",session);
    return session?.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/signin')
  }
  
  return user
}

export async function checkUserComplete(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        studentNumber: true,
        schoolId: true,
        programName: true,
      },
    })
    
    return !!(user?.studentNumber && user?.schoolId && user?.programName)
  } catch (error) {
    console.error("Error checking user complete:", error)
    return false
  }
}
