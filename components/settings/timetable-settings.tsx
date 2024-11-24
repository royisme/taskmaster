import { TimeTableSettings } from "@/types/settings";

// components/settings/timetable-settings.tsx
function TimetableSettings({
    settings,
    onSettingsChange
  }: {
    settings: TimeTableSettings;
    onSettingsChange: (settings: TimeTableSettings) => void;
  }) {
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Display Days</label>
          <select
            value={settings.daysToShow}
            onChange={(e) => onSettingsChange({
              ...settings,
              daysToShow: parseInt(e.target.value) as 5 | 7
            })}
            className="mt-1 block w-full"
          >
            <option value={5}>Monday - Friday</option>
            <option value={7}>Full Week</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Week Starts On</label>
          <select
            value={settings.weekStartDay}
            onChange={(e) => onSettingsChange({
              ...settings,
              weekStartDay: parseInt(e.target.value) as 0 | 1
            })}
            className="mt-1 block w-full"
          >
            <option value={1}>Monday</option>
            <option value={0}>Sunday</option>
          </select>
        </div>
      </div>
    );
  }