import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import * as moment from 'moment';

import { IUserInfoPanelData } from '../user-info.service';
import { USER_INFO_PANEL_DATA } from '../user-info.tokens';

@Component({
  selector: 'app-user-info-panel',
  templateUrl: './user-info-panel.component.html',
  styleUrls: ['./user-info-panel.component.scss'],
  animations: [
    trigger('panelContent', [
      state('void', style({ opacity: 0 })),
      state('enter', style({ opacity: 1 })),
      state('leave', style({ opacity: 0 })),
      transition('* => *', animate('200ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
    ])
  ]
})
export class UserInfoPanelComponent implements OnInit {
  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();

  employmentDateFormatted: string;
  experience: string;

  constructor(
    @Inject(USER_INFO_PANEL_DATA) public panelData: IUserInfoPanelData,
  ) { }

  ngOnInit() {
    // отформатированная дата приема
    this.employmentDateFormatted = moment(this.panelData.user.employmentDate, 'YYYY-MM-DD').format('DD MMMM YYYY');

    // стаж
    this.experience = this.calculateExperience();
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

  // Расчет стажа
  private calculateExperience(): string {
    let experienceText = '';

    if (this.panelData.user.employmentDate) {
      let difference;
      const employmentDate = moment(this.panelData.user.employmentDate, 'YYYY-MM-DD');

      // если сотрудник уволен - сравнить с датой увольнения
      // иначе, - с текущей датой
      if (this.panelData.user.dismissDate) {
        const dismissalDate = moment(this.panelData.user.dismissDate, 'YYYY-MM-DD');
        difference = moment.duration(dismissalDate.diff(employmentDate));
      }
      else {
        difference = moment.duration(moment().diff(employmentDate));
      }

      experienceText = difference.humanize();
    }

    return experienceText;
  }

}
