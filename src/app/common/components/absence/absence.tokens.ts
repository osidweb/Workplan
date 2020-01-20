import { InjectionToken } from '@angular/core';

import { IAbsencePanelData } from './absence.service';

export const ABSENCE_PANEL_DATA = new InjectionToken<IAbsencePanelData>('ABSENCE_PANEL_DATA');
