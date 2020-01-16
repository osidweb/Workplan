import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';

import { AbsenceRef } from '../absence-ref';
import { ABSENCE_PANEL_DATA } from '../absence.tokens';
import { IAbsencePanelData } from '../../absence.service';

@Component({
  selector: 'app-absence-panel',
  templateUrl: './absence-panel.component.html',
  styleUrls: ['./absence-panel.component.scss'],
  animations: [
    trigger('panelContent', [
      state('void', style({ opacity: 0 })),
      state('enter', style({ opacity: 1 })),
      state('leave', style({ opacity: 0 })),
      transition('* => *', animate('200ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
    ])
  ]
})
export class AbsencePanelComponent implements OnInit {
  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(
    private dialogRef: AbsenceRef,
    @Inject(ABSENCE_PANEL_DATA) public panelData: IAbsencePanelData
  ) {}

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

}
