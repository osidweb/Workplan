import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import * as moment from 'moment';

import { CalendarRef } from '../calendar-ref';
import { ICalendarPanelData } from '../calendar.service';
import { CALENDAR_PANEL_DATA } from '../calendar.tokens';

@Component({
  selector: 'app-calendar-panel',
  templateUrl: './calendar-panel.component.html',
  styleUrls: ['./calendar-panel.component.scss'],
  animations: [
    trigger('panelContent', [
      state('void', style({ opacity: 0 })),
      state('enter', style({ opacity: 1 })),
      state('leave', style({ opacity: 0 })),
      transition('* => *', animate('200ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
    ])
  ]
})
export class CalendarPanelComponent implements OnInit {
  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();

  // дата выполнения просьбы
  taskDate: string;
  // выбранная в календаре дата
  selectedDate: moment.Moment;
  // отформатированная выбранная в календаре дата (для вывода на панель)
  formattedSelectedDate: string;
  // на какой дате откроется календарь
  startDate: moment.Moment;

  constructor(
    private dialogRef: CalendarRef,
    @Inject(CALENDAR_PANEL_DATA) public panelData: ICalendarPanelData
  ) { }

  ngOnInit() {
    console.log('panelData = ', this.panelData);
    // дата выполнения просьбы
    // this.taskDate = this.panelData.dateModel;
    this.selectedDate = this.panelData.selectDate ? this.panelData.selectDate : null;
    // this.formattedSelectedDate = this.taskDate ? this.selectedDate.format('DD MMM YYYY') : dateNotSelected;
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

  // выбрана дата в календаре
  dateChanged(date: moment.Moment): void {
    this.selectedDate = date;
    this.formattedSelectedDate = this.selectedDate.format('DD MMM YYYY');
  }

}
