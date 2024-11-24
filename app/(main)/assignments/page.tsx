// app/(main)/assignments/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react"
import { getAssignmentGroups } from "./actions"
import { AssignmentList } from "@/components/assignments/assignment-list"
import { AddAssignmentDialog } from "@/components/assignments/add-assignment-dialog"
import { Loader2 } from "lucide-react"

async function AssignmentContent() {
  const groups = await getAssignmentGroups()
  
  return (
    <>
      <AssignmentList groups={groups} />
      <AddAssignmentDialog />
    </>
  )
}

export default async function AssignmentsPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
      </div>
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }>
        <AssignmentContent />
      </Suspense>
    </div>
  )
}

