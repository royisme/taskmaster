// app/auth/complete-profile/actions.ts
'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authConfig } from "@/config/auth.config"
import { z } from "zod"

const profileSchema = z.object({
  studentNumber: z.string().optional(),
  schoolId: z.string().min(1, "School selection is required"), // 确保 schoolId 必填
  programName: z.string().optional(),
})

export async function completeUserProfile(data: z.infer<typeof profileSchema>) {
  try {
    // 验证输入数据
    const validData = profileSchema.parse(data)
    
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...validData,
        updatedAt: new Date(),
      }
    })

    revalidatePath('/', 'layout')
    
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Profile update error:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "School selection is required"
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile"
    }
  }
}