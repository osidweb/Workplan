import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import * as moment from 'moment';

import { CalendarRef } from '../calendar-ref';
import { ICalendarPanelData } from '../calendar.service';
import { CALENDAR_PANEL_DATA } from '../calendar.tokens';
import { MatCalendar } from '@angular/material';

@Component({
  selector: 'app-calendar-panel',
  templateUrl: './calendar-panel.component.html',
  styleUrls: ['./calendar-panel.component.scss'],
  animations: [
    trigger('panelContent', [
      state('void', style({ opacity: 0 })),
      state('enter', style({ opacity: 1 })),
      state('leave', style({ opacity: 0 })),
      transition('* => *', animate('0ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
    ])
  ]
})
export class CalendarPanelComponent implements OnInit {
  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();

  // выбранная в календаре дата
  selectedDate: moment.Moment;
  // на какой дате откроется календарь
  startDate: moment.Moment;

  constructor(
    private dialogRef: CalendarRef,
    @Inject(CALENDAR_PANEL_DATA) public panelData: ICalendarPanelData
  ) { }

  ngOnInit() {
    this.selectedDate = this.panelData.selectDate ? this.panelData.selectDate : null;
    this.startDate = this.panelData.selectDate ? this.panelData.selectDate : moment();
  }

  onAnimationStart(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  onAnimationDone(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  startExitAnimation(): void {
    this.animationState = 'leave';
  }

  // выбрана дата в календаре (месяц)
  monthSelectedHandler(date: moment.Moment): void {
    this.dialogRef.close(date);
  }

}
