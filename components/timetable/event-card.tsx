// components/timetable/event-card.tsx
import { Card } from "@/components/ui/card";
import { EventCardProps, WeekEvent } from "@/types/settings";

export function EventCard({ event, columnWidth, hourHeight, settings }: EventCardProps) {
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  
  // 计算位置
  const startHour = startDate.getHours();
  const endHour = endDate.getHours();
  const duration = endHour - startHour;
  const top = (startHour - settings.dayStartHour) * hourHeight;
  
  // 计算列位置
  // dayOfWeek 是 1-7, weekStartDay 是 1 (周一)
  const column = event.dayOfWeek - settings.weekStartDay;
  const left = column * columnWidth;



  return (
    <Card
      className={`
        absolute p-2 rounded-lg overflow-hidden cursor-pointer
        hover:ring-2 hover:ring-white/20 transition-all
        ${event.dayOfWeek >= 6 ? 'opacity-90' : 'opacity-100'}
      `}
      style={{
        backgroundColor: event.color,
        top: `${top}px`,
        height: `${Math.max(1, duration) * hourHeight}px`,
        left: `${left}px`,
        width: `${columnWidth - 4}px`,
        zIndex: 10
      }}
    >
      <div className="text-white h-full overflow-hidden">
        <div className="font-medium truncate">
          {event.summary}
        </div>
        {duration > 1 && (
          <>
            <div className="text-sm opacity-80 truncate">
              {event.location}
            </div>
            <div className="text-sm opacity-60 truncate mt-1">
              {`${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
export interface EventClickHandler {
  onEventClick?: (event: WeekEvent) => void;
}