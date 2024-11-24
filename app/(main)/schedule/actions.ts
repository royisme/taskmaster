// app/(main)/schedule/actions.ts
"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/utils/auth.helper"
import { TaskStatus } from "@prisma/client"
import { 
  startOfWeek, 
  endOfWeek, 
  addDays,
  isSameDay,
  format 
} from "date-fns"
import { revalidatePath } from "next/cache"



export async function getWeekSchedule(date: Date) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

    // 获取课程事件及其关联的未完成任务
    const courseEvents = await prisma.courseEvent.findMany({
      where: {
        userId: user.id,
        AND: [
          { startTime: { gte: weekStart } },
          { endTime: { lte: weekEnd } }
        ]
      },
      include: {
        academicTasks: {
          where: {
            status: 'PENDING'
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    // 计算每天未完成任务的数量
    const pendingTasksMap: Record<string, number> = {};
    for (const event of courseEvents) {
      const dateStr = format(event.startTime, 'yyyy-MM-dd');
      pendingTasksMap[dateStr] = (pendingTasksMap[dateStr] || 0) + 
        event.academicTasks.length;
    }

    return {
      success: true as const,
      data: {
        startDate: weekStart,
        endDate: weekEnd,
        courseEvents,
        pendingTasksMap
      }
    };

  } catch (error) {
    console.error("[GET_WEEK_SCHEDULE]", error);
    throw error;
  }
}

// 更新任务状态
export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    await prisma.academicTask.update({
      where: {
        id: taskId,
        userId: user.id
      },
      data: { 
        status,
        updatedAt: new Date()
      }
    });

    revalidatePath('/schedule');
  } catch (error) {
    console.error("[UPDATE_TASK_STATUS]", error);
    throw error;
  }
}