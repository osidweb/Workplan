import { WorkplanUser } from './workplan-user';
import { DayOfWeek } from './day-of-week';

export interface WorkplanRowData {
  selectedDate: string;
  users: WorkplanUser[];
  daysInMonth?: DayOfWeek[];
}
