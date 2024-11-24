// components/schedule/schedule-page.tsx
"use client"
import { useState, useEffect } from "react";
import { getWeekSchedule } from "@/app/(main)/schedule/actions";
import { DateSelector } from "./date-selector";
import { EventList } from "./event-list";
import { startOfWeek, isSameDay } from "date-fns";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekData, setWeekData] = useState<Awaited<ReturnType<typeof getWeekSchedule>>["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // 获取周数据
  const fetchWeekData = async (date: Date) => {
    try {
      setIsLoading(true);
      const result = await getWeekSchedule(date);
      if (result.success) {
        setWeekData(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load schedule",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载和周变化时获取数据
  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    fetchWeekData(weekStart);
  }, [selectedDate]);

  // 获取当天事件
  const todayEvents = weekData ? 
  weekData.courseEvents.filter(event => 
    isSameDay(new Date(event.startTime), selectedDate)
  ) : [];


  return (
    <div className="flex flex-col h-full bg-[#F5FBFF]">
      {weekData && (
        <DateSelector
          selectedDate={selectedDate}
          weekStart={weekData.startDate}
          pendingTasksMap={weekData.pendingTasksMap}
          onDateSelect={setSelectedDate}
        />
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex-1 px-4 space-y-3 pb-20">
          <EventList events={todayEvents} />
        </div>
      )}
    </div>
  );
}