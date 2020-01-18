import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

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

  absenceForm: FormGroup;

  constructor(
    private dialogRef: AbsenceRef,
    @Inject(ABSENCE_PANEL_DATA) public panelData: IAbsencePanelData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    console.log('panelData = ', this.panelData);

    this.absenceForm = this.formBuilder.group({
      cause: new FormControl(this.panelData.cause, [Validators.required])
      // sections: new FormArray(controls)
    });
    console.log('this.absenceForm.value = ', this.absenceForm.value);
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

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    console.log('form valid: ', this.absenceForm.valid);
  }

  // выбор причины отсутствия
  changeCause(value): void {
    console.log('changeCause: value = ', value);
  }

}
