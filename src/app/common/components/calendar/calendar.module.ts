import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material';

import { CalendarService } from './calendar.service';
import { CalendarPanelComponent } from './calendar-panel/calendar-panel.component';



@NgModule({
  declarations: [CalendarPanelComponent],
  imports: [
    CommonModule,
    MatDatepickerModule
  ],
  exports: [
    CalendarPanelComponent
  ],
  entryComponents: [
    CalendarPanelComponent
  ],
  providers: [
    CalendarService
  ]
})
export class CalendarModule { }
