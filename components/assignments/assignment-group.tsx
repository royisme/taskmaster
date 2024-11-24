// components/assignments/assignment-group.tsx
"use client"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
  import { Card, CardHeader, CardContent } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  import { ChevronDown, ChevronUp } from "lucide-react"
  import { useState } from "react"
  
  interface AssignmentGroupProps {
    title: string
    count: number
    defaultOpen?: boolean
    children: React.ReactNode
  }
  
  export function AssignmentGroup({ 
    title, 
    count, 
    defaultOpen = false, 
    children 
  }: AssignmentGroupProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="font-semibold">{title}</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{count}</Badge>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              {children}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    )
  }