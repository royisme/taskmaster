// app/api/today/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/utils/auth.helper";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date') || new Date().toISOString();
    const date = new Date(dateStr);

    // 获取当天的所有事件
    const [courseEvents, academicTasks] = await Promise.all([
      // 获取课程事件
      prisma.courseEvent.findMany({
        where: {
          userId: user.id,
          dayOfWeek: date.getDay(),
          // 排除已经创建了学术任务的事件
          NOT: {
            academicTasks: {
              some: {}
            }
          }
        },
        orderBy: {
          startTime: 'asc'
        }
      }),
      
      // 获取学术任务
      prisma.academicTask.findMany({
        where: {
          userId: user.id,
          OR: [
            {
              startTime: {
                gte: startOfDay(date),
                lt: endOfDay(date)
              }
            },
            {
              dueDate: {
                gte: startOfDay(date),
                lt: endOfDay(date)
              }
            }
          ]
        },
        include: {
          course: true,
          courseEvent: true
        },
        orderBy: {
          dueDate: 'asc'
        }
      })
    ]);

    return NextResponse.json({
      courseEvents,
      academicTasks
    });
  } catch (error) {
    console.error("[TODAY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}