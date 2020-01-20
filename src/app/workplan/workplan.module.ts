import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatIconModule } from '@angular/material';

import { WorkplanComponent } from './workplan.component';
import { WorkplanCalendarHeaderComponent } from './calendar-header/workplan-calendar-header/workplan-calendar-header.component';
import { WorkplanRowComponent } from './calendar-body/workplan-row/workplan-row.component';
import { AbsenceModule } from '../common/components/absence/absence.module';
import { UserInfoModule } from '../common/components/user-info/user-info.module';



@NgModule({
  declarations: [
    WorkplanComponent,
    WorkplanCalendarHeaderComponent,
    WorkplanRowComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    AbsenceModule,
    UserInfoModule
  ],
  exports: [
    WorkplanComponent
  ]
})
export class WorkplanModule { }
