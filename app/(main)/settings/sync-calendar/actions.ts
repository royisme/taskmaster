"use server"

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import ICAL from 'ical.js';
import { getCurrentUser } from "@/lib/utils/auth.helper";
import { TaskSource, TaskStatus, TaskType } from "@prisma/client";
import { generateFingerprintId } from "@/lib/utils";
// Validation schema for file
const icsFileSchema = z.object({
  name: z.string().endsWith(".ics"),
  size: z.number().max(5 * 1024 * 1024), // 5MB limit
  type: z.string().regex(/^text\/calendar/)
});

// 辅助函数：从Location提取课程信息
function extractCourseInfo(location: string | undefined) {
  if (!location) return null;
  // 排除zoom链接
  if (location.toLowerCase().includes('zoom')) return null;
  
  const courseMatch = location.match(/([A-Z]+\d+)-(\d{2}[WFS])-Sec\d+-(.*)/);
  if (!courseMatch) return null;
  
  return {
    code: courseMatch[1],
    name: courseMatch[3].trim()
  };
}

// 添加事件分析函数
function analyzeEventType(summary: string): {
  taskType: TaskType | null;
  title: string;
} {
  const lower = summary.toLowerCase();
  let taskType: TaskType | null = null;
  
  if (lower.includes('assignment')) {
    taskType = 'ASSIGNMENT';
  } else if (lower.includes('quiz')) {
    taskType = 'QUIZ';
  } else if (lower.includes('exam')) {
    taskType = 'EXAM';
  } else if (lower.includes('project') && lower.includes('due')) {
    taskType = 'PROJECT';
  } else if (lower.includes('paper') && lower.includes('due')) {
    taskType = 'PAPER';
  }

  return {
    taskType,
    title: summary.split('-')[0].trim()
  };
}

function parseICSContent(content: string) {
  try {
    const jcalData = ICAL.parse(content);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    return vevents.map(vevent => {
      const event = new ICAL.Event(vevent);
      if (!event.summary || !event.startDate || !event.endDate) {
        console.warn('Skipping invalid event:', event);
        return null;
      }

      return {
        summary: event.summary,
        start: event.startDate.toJSDate(),
        end: event.endDate.toJSDate(),
        location: event.location || undefined
      };
    }).filter((event): event is NonNullable<typeof event> => event !== null);
  } catch (error) {
    console.error("Parse error:", error);
    throw new Error("Failed to parse ICS file");
  }
}

export async function uploadAndParseICS(formData: FormData) {
  try {
    // 1. 基础验证
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Unauthorized user");
    
    // 2. 文件验证和解析
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");
    // ... 文件验证逻辑
    const content = await file.text();
    const events = parseICSContent(content);

    // 3. 获取现有课程（无事务）
    const coursesCache: Record<string, string> = {};
    const existingCourses = await prisma.course.findMany({
      where: { userId: user.id },
      select: { id: true, code: true }
    });
    existingCourses.forEach(course => {
      coursesCache[course.code] = course.id;
    });

    // 4. 清理旧数据（无事务）
    await prisma.academicTask.deleteMany({ where: { userId: user.id } });
    await prisma.courseEvent.deleteMany({ where: { userId: user.id } });
    await prisma.iCSFile.deleteMany({ where: { userId: user.id } });

    // 5. 创建同步记录
    const syncRecord = await prisma.iCSFile.create({
      data: {
        fileName: file.name,
        userId: user.id,
        lastSync: new Date()
      }
    });

  const createdEvents = [];
  const createdTasks = [];
  let createEventNumber = 0;
  let createTaskNumber = 0;

  for (const event of events) {
     // 检查是否为学术任务
    const courseInfo = event.location ? extractCourseInfo(event.location) : null;
    const { taskType, title } = analyzeEventType(event.summary);
    let bgColor = '#A9A9A9';
    
    switch (taskType) {
      case 'ASSIGNMENT': bgColor = '#FF6F61'; break; // Coral
      case 'QUIZ': bgColor = '#FFD700'; break; // Gold
      case 'EXAM': bgColor = '#FF4500'; break; // OrangeRed
      case 'PROJECT': bgColor = '#32CD32'; break; // LimeGreen
      case 'PAPER': bgColor = '#4682B4'; break; // SteelBlue
      default: bgColor = '#A9A9A9'; break; // DarkGray
    }

    createEventNumber++;

    if (courseInfo && taskType) {    // 创建 CourseEvent
      const courseEvent = await prisma.courseEvent.create({
        data: {
          summary: event.summary,
          startTime: event.start,
          endTime: event.end,
          location: event.location || null,
          dayOfWeek: event.start.getDay(),
          icsFileId: syncRecord.id,
          userId: user.id,
          color: bgColor
        }
      });
      // 获取或创建课程
      let courseId = coursesCache[courseInfo.code];
      if (!courseId) {
        const newCourse = await prisma.course.create({
          data: {
            code: courseInfo.code,
            name: courseInfo.name,
            userId: user.id
          }
        });
        courseId = newCourse.id;
        coursesCache[courseInfo.code] = courseId;
      }

      // 创建关联的学术任务
      const task = await prisma.academicTask.create({
        data: {
          title,
          startTime: event.start,
          dueDate: event.end,
          description: event.summary,
          status: 'PENDING',
          taskType,
          source: 'CALENDAR_IMPORT',
          sourceEventId: courseEvent.id, // 关联到刚创建的事件
          userId: user.id,
          courseId
        }
      });
      createTaskNumber++;
    }else{

      createdEvents.push({
        summary: event.summary,
        startTime: event.start,
        endTime: event.end,
        location: event.location || null,
        dayOfWeek: event.start.getDay(),
        icsFileId: syncRecord.id,
        userId: user.id,
        color: bgColor
      })
    }


  }
  if (createdEvents.length > 0) {
    await prisma.courseEvent.createMany({
      data: createdEvents
    });
  }

    // 9. 刷新页面
    revalidatePath("/settings/sync-calendar");
    revalidatePath("/assignments");
    revalidatePath("/schedule");

    return {
      success: true,
      data: {
        message: `Successfully imported ${createEventNumber} events and ${createTaskNumber} tasks`,
        coursesCount: Object.keys(coursesCache).length,
        eventsCount: createdEvents.length,
        tasksCount: createdTasks.length
      }
    };
  } catch (error) {
    console.error("ICS upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed"
    };
  }
}
export async function checkImportedData() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const stats = await prisma.$transaction(async (tx) => {
      // 获取最近同步信息
      const lastSync = await tx.iCSFile.findFirst({
        where: { userId: user.id },
        orderBy: { lastSync: 'desc' },
        select: {
          lastSync: true,
          fileName: true,
        }
      });

      // 获取课程统计
      const courseStats = await tx.courseEvent.groupBy({
        by: ['dayOfWeek'],
        where: { userId: user.id },
        _count: true,
      });

      // 获取时间范围
      const timeRange = await tx.courseEvent.aggregate({
        where: { userId: user.id },
        _min: { startTime: true },
        _max: { endTime: true },
      });

      return {
        lastSync,
        courseStats,
        timeRange,
        totalCourses: await tx.courseEvent.count({
          where: { userId: user.id }
        })
      };
    });

    return {
      success: true,
      data: stats
    };
  } catch (error) {
    console.error("Check data error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Check failed"
    };
  }
}