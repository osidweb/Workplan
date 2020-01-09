import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatIconModule } from '@angular/material';

import { WorkplanComponent } from './workplan.component';
import { WorkplanCalendarHeaderComponent } from './calendar_header/workplan-calendar-header/workplan-calendar-header.component';



@NgModule({
  declarations: [
    WorkplanComponent,
    WorkplanCalendarHeaderComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule
  ],
  exports: [
    WorkplanComponent
  ]
})
export class WorkplanModule { }
