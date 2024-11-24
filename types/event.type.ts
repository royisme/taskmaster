export interface Event {
    id: string;
    summary: string;
    start: Date;
    end: Date;
    room?: string;
    color: string;
}
export const COURSE_COLORS: { [key: string]: string } = {
  "Org Mgt": "#FFB800",      // 橙色
  "Financial Mgt": "#7B61FF", // 蓝紫色
  "Macro": "#4CD964",        // 绿色
  "Micro": "#FF00FF",        // 紫色
}
