// components/schedule/date-selector/date-card.tsx
import { format } from "date-fns";

interface DateCardProps {
  date: Date
  isSelected: boolean
  pendingTasks: number
  onClick: () => void
}

export function DateCard({ date, isSelected, pendingTasks, onClick }: DateCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center min-w-[60px] p-2 rounded-xl cursor-pointer ${
        isSelected ? "bg-[#80B3FF] text-white" : "bg-white"
      }`}
    >
      <span className="text-xl font-semibold">{format(date, 'd')}</span>
      <span className="text-sm">{format(date, 'EEE')}</span>
      {pendingTasks > 0 && (
        <div className="mt-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {pendingTasks}
        </div>
      )}
    </div>
  );
}