import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatIconModule } from '@angular/material';

import { WorkplanComponent } from './workplan.component';
import { WorkplanCalendarHeaderComponent } from './calendar-header/workplan-calendar-header/workplan-calendar-header.component';
import { WorkplanRowComponent } from './calendar-body/workplan-row/workplan-row.component';
import { AbsenceModule } from '../common/components/absence/absence.module';
import { UserInfoModule } from '../common/components/user-info/user-info.module';
import { CalendarModule } from '../common/components/calendar/calendar.module';
import { WorkplanRowMobileComponent } from './calendar-body/workplan-row-mobile/workplan-row-mobile.component';
import { WorkplanRowPrototypeComponent } from './calendar-body/workplan-row-prototype/workplan-row-prototype.component';



@NgModule({
  declarations: [
    WorkplanComponent,
    WorkplanCalendarHeaderComponent,
    WorkplanRowComponent,
    WorkplanRowMobileComponent,
    WorkplanRowPrototypeComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    AbsenceModule,
    UserInfoModule,
    CalendarModule
  ],
  exports: [
    WorkplanComponent
  ]
})
export class WorkplanModule { }
