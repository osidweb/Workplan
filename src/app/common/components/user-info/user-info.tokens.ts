import { InjectionToken } from '@angular/core';

import { IUserInfoPanelData } from './user-info.service';

export const USER_INFO_PANEL_DATA = new InjectionToken<IUserInfoPanelData>('USER_INFO_PANEL_DATA');
