import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TimeTableSettings } from "@/types/settings";

interface TimetableHeaderProps {
  weekDays: Date[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  settings: TimeTableSettings;
}

export function TimetableHeader({ 
  weekDays, 
  onPrevWeek, 
  onNextWeek,
  settings 
}: TimetableHeaderProps) {
  return (
    <header className="px-4 pt-6 pb-4 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <div className="text-sm text-gray-500">
          {format(weekDays[0], "MMM d")} - {
            format(weekDays[weekDays.length - 1], "MMM d, yyyy")
          }
        </div>
      </div>

      {/* 悬浮的导航按钮 */}
      <button 
        onClick={onPrevWeek}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white shadow-md rounded-r-xl z-10 backdrop-blur-sm"
        style={{ top: '60%' }}
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      <button 
        onClick={onNextWeek}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white shadow-md rounded-l-xl z-10 backdrop-blur-sm"
        style={{ top: '60%' }}
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>

      {/* 日期网格 */}
      <div 
        className="grid gap-1 mx-4" 
        style={{ 
          gridTemplateColumns: `repeat(${settings.daysToShow}, 1fr)` 
        }}
      >
        {weekDays.map((date, index) => (
          <div
            key={index}
            className="flex flex-col items-center py-2"
          >
            <span className="text-sm text-gray-500 font-medium">
              {format(date, 'EEE')}
            </span>
            <span className="text-base font-semibold mt-1">
              {format(date, 'd')}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
}