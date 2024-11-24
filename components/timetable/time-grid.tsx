import { format } from "date-fns";
import { Event } from "@/types/event.type";
import { Card } from "@/components/ui/card";

export function TimeGrid({ events }: { events: Event[] }) {
    // 生成时间轴（9AM - 2PM）
    const timeSlots = Array.from({ length: 6 }, (_, i) => {
      const hour = i + 9;
      return {
        hour,
        label: format(new Date().setHours(hour, 0), "hh:mm"),
        meridiem: hour < 12 ? "AM" : "PM"
      };
    });
  
    return (
      <div className="flex flex-1 overflow-hidden">
        {/* 时间轴 */}
        <div className="w-16 flex-shrink-0 border-r border-gray-100">
          {timeSlots.map((slot) => (
            <div key={slot.hour} className="h-20 flex flex-col justify-start p-2">
              <span className="text-xs text-gray-500">{slot.label}</span>
              <span className="text-xs text-gray-400">{slot.meridiem}</span>
            </div>
          ))}
        </div>
  
        {/* 课程网格 */}
        <div className="flex-1 relative">
          {events.map((event) => {
            const startHour = event.start.getHours();
            const endHour = event.end.getHours();
            const duration = endHour - startHour;
            const top = (startHour - 9) * 5; // 5rem per hour
            
            return (
              <Card
                key={event.id}
                className="absolute left-0 right-0 m-1 p-3 shadow-sm"
                style={{
                  backgroundColor: event.color,
                  top: `${top}rem`,
                  height: `${duration * 5}rem`,
                }}
              >
                <div className="text-white">
                  <h3 className="font-medium">{event.summary}</h3>
                  {event.room && (
                    <p className="text-sm opacity-80">{event.room}</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }