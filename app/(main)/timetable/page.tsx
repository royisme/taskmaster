"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback } from "react";
import { format, addWeeks, subWeeks, startOfWeek, addDays } from "date-fns";
import { TimeTableSettings, DEFAULT_TIMETABLE_SETTINGS, WeekEvent } from "@/types/settings";
import { TimetableHeader } from "@/components/timetable/timetable-header";
import { EventCard } from "@/components/timetable/event-card";
import { useSwipeGesture } from "@/hooks/use-swipe";
import { Loader2 } from "lucide-react";
import { getCurrentUser } from "@/lib/utils/auth.helper";
import { useRouter } from "next/navigation";


export default  function TimetablePage() {
  const router = useRouter();

  const [settings] = useState<TimeTableSettings>(DEFAULT_TIMETABLE_SETTINGS);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState<WeekEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({
    columnWidth: 0,
    hourHeight: 80,
  });

  const fetchEvents = useCallback(async (date: Date) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/timetable/events?date=${date.toISOString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const rawData = await response.json();

      const transformedData = rawData.map((event: any) => ({
        ...event,
        startTime: new Date(event.startTime), 
        endTime: new Date(event.endTime)      
      }));
      setEvents(transformedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(currentWeek);
  }, [currentWeek, fetchEvents]);

  const handleWeekChange = useCallback((direction: 'left' | 'right') => {
    setCurrentWeek(prev => 
      direction === 'left' ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  }, []);
  // 使用滑动手势hook
  const isSwiping = useSwipeGesture(handleWeekChange);

  // 计算网格尺寸
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('timetable-container');
      if (container) {
        const contentWidth = container.clientWidth - 60; // 60px 是时间轴宽度
        const calculatedWidth = contentWidth / settings.daysToShow;
        
        setDimensions(prev => ({
          ...prev,
          columnWidth: calculatedWidth,
        }));


      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [settings.daysToShow]);


  // 生成时间相关数据
  const startDate = startOfWeek(currentWeek, { weekStartsOn: settings.weekStartDay });
  const weekDays = Array.from(
    { length: settings.daysToShow }, 
    (_, i) => addDays(startDate, i)
  );
  const timeSlots = Array.from(
    { length: settings.dayEndHour - settings.dayStartHour },
    (_, i) => settings.dayStartHour + i
  );

  return (
    <div 
      id="timetable-container"
      className="flex flex-col h-full bg-white touch-pan-y"
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        opacity: isSwiping ? 0.7 : 1,
        transition: 'opacity 0.2s ease'
      }}
    >
      <TimetableHeader 
        weekDays={weekDays}
        onPrevWeek={() => handleWeekChange('right')}
        onNextWeek={() => handleWeekChange('left')}
        settings={settings}
      />

      {isSwiping && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            Release to change week
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button 
              onClick={() => fetchEvents(currentWeek)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-[60px,1fr] h-full min-w-full">
            {/* 时间轴列 */}
            <div className="sticky left-0 w-[60px] bg-white z-20 border-r border-gray-200">
            {timeSlots.map(hour => (
                <div 
                  key={hour} 
                  className="flex items-center justify-end pr-2"
                  style={{ height: `${dimensions.hourHeight}px` }}
                >
                  <div className="text-xs text-gray-500">
                    {format(new Date().setHours(hour, 0), "HH:mm")}
                  </div>
                </div>
              ))}
            </div>

              {/* 可滚动的内容区域 */}
              <div className="flex-1 overflow-auto">
            {/* 网格背景 */}
            <div 
              className="relative"
              style={{
                width: `${dimensions.columnWidth * settings.daysToShow}px`,
                minWidth: '100%'
              }}
            >
              {/* 水平时间线 */}
              {timeSlots.map(hour => (
                <div
                  key={hour}
                  className="border-b border-gray-100"
                  style={{ height: `${dimensions.hourHeight}px` }}
                />
              ))}

              {/* 事件卡片 */}
              {events.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  columnWidth={dimensions.columnWidth}
                  hourHeight={dimensions.hourHeight}
                  settings={settings}
                />
                ))}
              </div>
            </div>
            </div>
          </div>
        )}
    </div>
  );
}