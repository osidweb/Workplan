import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';

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

  constructor() { }

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
