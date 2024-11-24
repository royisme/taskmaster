// components/schedule/date-selector/index.tsx
"use client"
import { DateCard } from "./date-card";
import { addDays, format, isSameDay } from "date-fns";

interface DateSelectorProps {
  selectedDate: Date
  weekStart: Date
  pendingTasksMap: Record<string, number>
  onDateSelect: (date: Date) => void
}

export function DateSelector({ 
  selectedDate, 
  weekStart,
  pendingTasksMap,
  onDateSelect 
}: DateSelectorProps) {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      date,
      pendingTasks: pendingTasksMap[dateStr] || 0
    };
  });

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">
        {format(selectedDate, "MMMM d, yyyy")}
      </h1>
      
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {dates.map(({ date, pendingTasks }) => (
          <DateCard
            key={format(date, 'yyyy-MM-dd')}
            date={date}
            isSelected={isSameDay(date, selectedDate)}
            pendingTasks={pendingTasks}
            onClick={() => onDateSelect(date)}
          />
        ))}
      </div>
    </div>
  );
}