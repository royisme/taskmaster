// components/schedule/event-list/index.tsx
"use client"
import { CourseEvent, AcademicTask } from "@prisma/client"
import { EventCard } from "./event-card"
import { isWithinInterval } from "date-fns"

interface EventListProps {
  events: Array<CourseEvent & {
    academicTasks: AcademicTask[]
  }>
}

export function EventList({ events }: EventListProps) {
  // 判断事件是否正在进行
  const isCurrentTime = (event: CourseEvent) => {
    const now = new Date()
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)
    return now >= start && now <= end
  }
  
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isCurrentTime={isCurrentTime(event)}
        />
      ))}
    </div>
  )
}