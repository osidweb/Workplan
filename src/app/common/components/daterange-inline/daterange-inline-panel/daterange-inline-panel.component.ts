import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import * as moment from 'moment';
import * as localization from 'moment/locale/ru';
moment.locale('ru', localization);

import { DaterangeInlineRef } from '../daterange-inline-ref';
import { IDaterangeInlinePanelData } from '../daterange-inline.service';
import { DATERANGE_INLINE_PANEL_DATA } from '../daterange-inline.tokens';

export interface DaterangeOutputData {
  chosenLabel: string;
  editDate: {
    startDate: moment.Moment;
    endDate: moment.Moment;
  };
}

@Component({
  selector: 'app-daterange-inline-panel',
  templateUrl: './daterange-inline-panel.component.html',
  styleUrls: ['./daterange-inline-panel.component.scss'],
  animations: [
    trigger('panelContent', [
      state('void', style({ opacity: 0 })),
      state('enter', style({ opacity: 1 })),
      state('leave', style({ opacity: 0 })),
      transition('* => *', animate('200ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
    ])
  ]
})
export class DaterangeInlinePanelComponent implements OnInit {
  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(
    private dialogRef: DaterangeInlineRef,
    @Inject(DATERANGE_INLINE_PANEL_DATA) public panelData: IDaterangeInlinePanelData
  ) { }

  ngOnInit() {
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

  // выбор даты и передача ее вызвавшему панель компоненту
  choosedDate(event: any): void {
    const data: DaterangeOutputData = {
      chosenLabel: event.chosenLabel,
      editDate: {
        startDate: event.startDate,
        endDate: event.endDate
      }
    };
    this.dialogRef.close(data);
  }

}
