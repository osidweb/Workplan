import { InjectionToken } from '@angular/core';

import { ICalendarPanelData } from './calendar.service';

export const CALENDAR_PANEL_DATA = new InjectionToken<ICalendarPanelData>('CALENDAR_PANEL_DATA');
