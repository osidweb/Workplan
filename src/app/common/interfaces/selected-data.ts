import * as moment from 'moment';
import { WorkplanUser } from './workplan-user';

export interface SelectedData {
  department: string;
  date: moment.Moment;
  user?: WorkplanUser;
}
