// components/assignments/assignment-card.tsx
"use client"
import { AcademicTask } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { updateAssignmentStatus } from "@/app/(main)/assignments/actions"

interface AssignmentCardProps {
  task: AcademicTask
}

export function AssignmentCard({ task }: AssignmentCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <Checkbox
        checked={task.status === "COMPLETED"}
        onCheckedChange={() => {
          updateAssignmentStatus(
            task.id, 
            task.status === "COMPLETED" ? "PENDING" : "COMPLETED"
          )
        }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-gray-900">{task.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {task.taskType}
          </Badge>
          <span className="text-xs text-gray-500">
            Due {format(task.dueDate, 'MMM d, h:mm a')}
          </span>
        </div>
        {task.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
    </div>
  )
}