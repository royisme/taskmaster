// types/assignment.ts

import { AcademicTask, TaskType } from "@prisma/client"

export interface AssignmentGroup {
  title: string
  tasks: AcademicTask[]
}

export interface CreateAssignmentInput {
  title: string
  dueDate: Date
  taskType: TaskType
  description?: string
  courseId: string
}


export interface Course {
  id: string
  code: string
  name: string
}