// components/schedule/event-list/event-card.tsx
"use client"
import { CourseEvent, AcademicTask } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface EventCardProps {
  event: CourseEvent & {
    academicTasks: AcademicTask[]
  }
  isCurrentTime?: boolean
}

export function EventCard({ event, isCurrentTime }: EventCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pendingTasksCount = event.academicTasks.length

  return (
    <Card 
      className="p-3 relative overflow-hidden"
      style={{ backgroundColor: "rgba(235, 235, 245, 0.6)" }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-start">
            {/* 时间部分 */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {format(new Date(event.startTime), "hh:mm a")}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(event.endTime), "hh:mm a")}
              </span>
            </div>
            
            {/* 内容部分 */}
            <div className="flex-[2]">
              <div 
                className="font-medium mb-1"
                style={{ color: event.color }}
              >
                {event.summary}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {event.location || "No Room"}
                </span>
                {pendingTasksCount > 0 && (
                  <Badge variant="destructive" className="rounded-full">
                    {pendingTasksCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        {/* 关联的任务列表 */}
        <CollapsibleContent>
          {event.academicTasks.length > 0 && (
            <div className="mt-3 pl-8 space-y-2">
              <h4 className="text-sm font-medium text-gray-500">
                Pending Tasks
              </h4>
              {event.academicTasks.map(task => (
                <div 
                  key={task.id}
                  className="text-sm p-2 bg-white rounded-md shadow-sm"
                >
                  <div className="font-medium">{task.title}</div>
                  <div className="text-gray-500">
                    Due: {format(new Date(task.dueDate), "MMM d, hh:mm a")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* 当前时间指示器 */}
      {isCurrentTime && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-red-500" />
      )}
    </Card>
  )
}