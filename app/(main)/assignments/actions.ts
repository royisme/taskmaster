// app/(main)/assignments/actions.ts
"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/utils/auth.helper"
import { revalidatePath } from "next/cache"
import { CreateAssignmentInput } from "@/types/assignment"
import { TaskStatus } from "@prisma/client"
import { startOfDay, endOfWeek, subDays, startOfWeek } from "date-fns"

export async function getAssignmentGroups() {
  const user = await getCurrentUser()
  if (!user?.id) throw new Error("Unauthorized")

  const today = startOfDay(new Date())
  const weekStart = startOfWeek(today)
  const weekEnd = endOfWeek(today)

  const tasks = await prisma.academicTask.findMany({
    where: {
      userId: user.id,
      OR: [
        {
          // Due This Week 的任务
          status: "PENDING",
          dueDate: {
            gte: weekStart,
            lte: weekEnd
          }
        },
        {
          // Upcoming 的任务
          status: "PENDING",
          dueDate: {
            gt: weekEnd
          }
        },
        {
          // 最近完成的任务
          status: "COMPLETED",
          updatedAt: {
            gte: subDays(today, 7)
          }
        }
      ]
    },
    orderBy: {
      dueDate: 'asc'
    }
  })

  return {
    dueThisWeek: tasks.filter(task => 
      task.status === "PENDING" && 
      task.dueDate >= weekStart && 
      task.dueDate <= weekEnd
    ),
    upcoming: tasks.filter(task => 
      task.status === "PENDING" && 
      task.dueDate > weekEnd
    ),
    completed: tasks.filter(task => 
      task.status === "COMPLETED"
    )
  } 
}

export async function createAssignment(data: CreateAssignmentInput) {
  const user = await getCurrentUser()
  if (!user?.id) throw new Error("Unauthorized")


  await prisma.academicTask.create({
    data: {
      ...data,
      userId: user.id,
      courseId: data.courseId, 
      source: "MANUAL_CREATE",
      status: "PENDING",
    }
  })

  revalidatePath('/assignments')
}

export async function updateAssignmentStatus(
  id: string, 
  status: TaskStatus
) {
  const user = await getCurrentUser()
  if (!user?.id) throw new Error("Unauthorized")

  await prisma.academicTask.update({
    where: { 
      id,
      userId: user.id  // 确保只能更新自己的任务
    },
    data: { 
      status,
      updatedAt: new Date() // 手动更新时间以便追踪完成时间
    }
  })

  revalidatePath('/assignments')
}

export async function deleteAssignment(id: string) {
  const user = await getCurrentUser()
  if (!user?.id) throw new Error("Unauthorized")

  await prisma.academicTask.delete({
    where: {
      id,
      userId: user.id  // 确保只能删除自己的任务
    }
  })

  revalidatePath('/assignments')
}

export async function getUserCourses() {
    const user = await getCurrentUser()
    if (!user?.id) throw new Error("Unauthorized")
  
    return prisma.course.findMany({
    where: { userId: user.id },
    select: { id: true, code: true, name: true }
  })
}