// components/assignments/assignment-list.tsx
import { AssignmentGroup } from "@/components/assignments/assignment-group"
import { AssignmentCard } from "@/components/assignments/assignment-card"
import { AcademicTask } from "@prisma/client"

interface AssignmentListProps {
  groups: {
    dueThisWeek: AcademicTask[]
    upcoming: AcademicTask[]
    completed: AcademicTask[]
  }
}

export function AssignmentList({ groups }: AssignmentListProps) {
  return (
    <div className="space-y-4">
      <AssignmentGroup 
        title="Due This Week" 
        count={groups.dueThisWeek.length}
        defaultOpen={true}
      >
        {groups.dueThisWeek.map(task => (
          <AssignmentCard key={task.id} task={task} />
        ))}
      </AssignmentGroup>

      <AssignmentGroup 
        title="Upcoming" 
        count={groups.upcoming.length}
      >
        {groups.upcoming.map(task => (
          <AssignmentCard key={task.id} task={task} />
        ))}
      </AssignmentGroup>

      <AssignmentGroup 
        title="Completed" 
        count={groups.completed.length}
      >
        {groups.completed.map(task => (
          <AssignmentCard key={task.id} task={task} />
        ))}
      </AssignmentGroup>
    </div>
  )
}