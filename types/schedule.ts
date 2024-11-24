import { AcademicTask, CourseEvent, TaskStatus } from "@prisma/client"
import { WeekEvent } from "./settings"

// 1. 日期卡片数据结构
export interface DateInfo {
  date: Date
  isToday: boolean
  isSelected: boolean
  pendingTasksCount: number
}

// 2. API响应类型
export interface DayScheduleResponse {
  courseEvents: CourseEvent[]
  academicTasks: (AcademicTask & {
    courseEvent?: CourseEvent
    course?: {
      id: string
      code: string
      name: string
    }
  })[]
}

// 3. Timeline组件Props
export interface TimelineProps {
  events: (CourseEvent | AcademicTask)[]
  isLoading?: boolean
}

// 4. DateSelector组件Props
export interface DateSelectorProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  pendingTasksMap: Record<string, number> // ISO日期字符串 -> 待办数
}

// 5. 事件卡片Props
export interface EventCardProps {
  event: CourseEvent | AcademicTask
  isCurrentTime?: boolean
  onStatusChange?: (id: string, status: TaskStatus) => Promise<void>
}