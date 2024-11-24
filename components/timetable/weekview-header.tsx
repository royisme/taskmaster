import { useState } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { Card } from "@/components/ui/card";
import { COURSE_COLORS } from "@/types/event.type";



// 获取课程颜色的辅助函数
// function getCourseColor(summary: string): string {
//   // 根据课程名称前几个字符来确定颜色
//   const courseKey = Object.keys(COURSE_COLORS).find(key => 
//     summary.toLowerCase().includes(key.toLowerCase())
//   );
//   return courseKey ? COURSE_COLORS[courseKey] : "#808080"; // 默认灰色
// }

export function WeekViewHeader({ dates, selectedDate, onDateSelect }: {
  dates: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}) {
  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Schedule</h1>
      <div className="flex space-x-4">
        {dates.map((date, i) => (
          <button
            key={i}
            onClick={() => onDateSelect(date)}
            className={`flex flex-col items-center min-w-[3rem] py-2 px-4 rounded-xl
              ${isSameDay(date, selectedDate) 
                ? "bg-[#80B3FF] text-white" 
                : "bg-white text-gray-600"}`}
          >
            <span className="text-sm font-medium">
              {format(date, "EEE")}
            </span>
            <span className="text-xl font-bold mt-1">
              {format(date, "d")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}