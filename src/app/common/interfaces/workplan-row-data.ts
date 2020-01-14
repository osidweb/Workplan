import { WorkplanUser } from './workplan-user';
import { DayOfWeek } from './day-of-week';

export interface WorkplanRowData {
  selectedDate: any;
  users: WorkplanUser[];
  daysInMonth?: DayOfWeek[];
}
