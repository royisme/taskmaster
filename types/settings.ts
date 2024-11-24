export interface TimeTableSettings {
    weekStartDay: 1 | 0;  // 1 for Monday, 0 for Sunday
    daysToShow: 5 | 7;    // 显示5天或7天
    dayStartHour: number; // 默认 9
    dayEndHour: number;   // 默认 17
  }

  export interface WeekEvent {
    id: string;
    summary: string;
    startTime: Date;
    endTime: Date;
    location: string;
    color: string;
    dayOfWeek: number; // 1-7
  }
  
  export interface EventCardProps {
    event: WeekEvent;
    columnWidth: number;
    hourHeight: number;
    settings: TimeTableSettings;
  }
  
  export const DEFAULT_TIMETABLE_SETTINGS: TimeTableSettings = {
    weekStartDay: 1,
    daysToShow: 5,
    dayStartHour: 7,
    dayEndHour: 22,
  };
  