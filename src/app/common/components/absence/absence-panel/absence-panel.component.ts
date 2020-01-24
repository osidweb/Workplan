import { Component, OnInit, EventEmitter, Inject, ElementRef, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';

import { AbsenceRef } from '../absence-ref';
import { ABSENCE_PANEL_DATA } from '../absence.tokens';
import { IAbsencePanelData } from '../absence.service';
import { IDaterangeInlinePanelData, DaterangeInlineService } from '../../daterange-inline/daterange-inline.service';
import { DaterangeOutputData } from '../../daterange-inline/daterange-inline-panel/daterange-inline-panel.component';

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
export class AbsencePanelComponent implements OnInit, OnDestroy {
  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();

  private destroyed = new Subject();

  absenceForm: FormGroup;

  // период неявки
  editDate: {
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
  };

  constructor(
    private dialogRef: AbsenceRef,
    @Inject(ABSENCE_PANEL_DATA) public panelData: IAbsencePanelData,
    private formBuilder: FormBuilder,
    private daterangeInlileService: DaterangeInlineService
  ) {}

  ngOnInit() {
    this.editDate = {
      startDate: moment(this.panelData.editDate.startDate, 'YYYY-MM-DD'),
      endDate: moment(this.panelData.editDate.endDate, 'YYYY-MM-DD')
    };
    const dateRangeValue = moment(this.editDate.startDate, 'YYYY-MM-DD').format('DD MMM YYYY') + ' - ' +
      moment(this.editDate.endDate, 'YYYY-MM-DD').format('DD MMM YYYY');

    // иинциализация формы
    this.absenceForm = this.formBuilder.group({
      cause: new FormControl(this.panelData.cause, [Validators.required]),
      daterange: new FormControl(dateRangeValue, [Validators.required])
    });
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

  // отменить
  cancel(): void {
    this.dialogRef.close(null);
  }

  // сохранить
  save(): void {
    if (this.absenceForm.valid) {

      const data = {
        act: this.panelData.editing ? 'edit' : 'create',
        cause: this.absenceForm.value.cause,
        editDate: this.editDate
      };

      this.dialogRef.close(data);
    }
  }

  // удалить
  delete(): void {
    const data = {
      act: 'delete',
      cause: this.absenceForm.value.cause,
      editDate: this.editDate
    };

    this.dialogRef.close(data);
  }

  // показать календарь (daterange) и выбрать дату
  showDaterange(event): void {
    const overlayOrigin: ElementRef = event.target;

    const panelData: IDaterangeInlinePanelData = {
      overlayOrigin,
      editDate: this.editDate
    };

    const daterangeInlineRef = this.daterangeInlileService.open(overlayOrigin, { data: panelData });

    // после закрытия панели
    daterangeInlineRef.afterClosed()
      .pipe(takeUntil(this.destroyed))
      .subscribe((result: DaterangeOutputData) => {
        if (result) {
          this.absenceForm.controls.daterange.setValue(result.chosenLabel);
          this.editDate = result.editDate;
        }
      });

    // обновить позицию панели
    setTimeout(() => {
      this.daterangeInlileService.updatePosition(overlayOrigin);
    }, 400);
  }

  ngOnDestroy() {
    this.destroyed.next(null);
    this.destroyed.complete();
  }

}
