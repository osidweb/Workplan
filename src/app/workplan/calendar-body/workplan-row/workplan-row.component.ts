import { Component, OnInit, Input, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { _ } from 'underscore';

import { DayOfWeek } from '../../../common/interfaces/day-of-week';
import { WorkplanUser } from '../../../common/interfaces/workplan-user';
import { DictionaryRecord } from '../../../common/interfaces/dictionary-record';
import { WorkplanRowModel } from 'src/app/common/interfaces/workplan-row-model';
import { WorkplanService } from 'src/app/common/services/workplan.service';
import { WorkplanRowData } from 'src/app/common/interfaces/workplan-row-data';
import { IAbsencePanelData, AbsenceService } from 'src/app/common/components/absence/absence.service';
import { WorkplanRowPrototypeComponent } from '../workplan-row-prototype/workplan-row-prototype.component';

interface IRowData {
  dayInWeekNumber: number;
  dayCause: string;
  dayAbsence: boolean;
  daySelected: boolean;
}

@Component({
  selector: 'app-workplan-row',
  templateUrl: './workplan-row.component.html',
  styleUrls: ['./workplan-row.component.scss']
})
export class WorkplanRowComponent extends WorkplanRowPrototypeComponent implements OnInit, OnDestroy {
  // @Input() userLogin: string;
  // @Input() causeList: DictionaryRecord[];

  // private destroyed = new Subject();
  listenFuncMousedown;

  // элемент обертка с классом 'line'
  lineElement: ElementRef;

  // selectedDate: any;
  // daysInMonth: DayOfWeek[];
  // user: WorkplanUser;

  // clickCount = 0;
  // clickOutsideElement = false;

  // model: WorkplanRowModel = {
  //   unid: null,
  //   login: null,
  //   editDate: {
  //     startDate: null,
  //     endDate: null,
  //   },
  //   cause: null
  // };

  // startDateEditing: string | null = null;
  // startActiveCellIndex: number | null = null;
  // startCellIndex: number | null = null;
  // endCellIndex: number | null = null;

  rowData: IRowData[] = [];

  constructor(
    eref: ElementRef,
    renderer: Renderer2,
    workplanService: WorkplanService,
    absenceService: AbsenceService
  ) {
    super(
      eref,
      renderer,
      workplanService,
      absenceService
    );
  }

  ngOnInit() {
    super.ngOnInit();

    // получить элемент обертку с классом 'line'
    this.lineElement = this.eref.nativeElement.querySelector('.line');

    // подписка на изменения даты/сотрудников
    this.workplanService.workplanDataChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe((wpData: WorkplanRowData) => {
        this.selectedDate = wpData.selectedDate;
        this.daysInMonth = wpData.daysInMonth;
        this.user = _.findWhere(wpData.users, { login: this.userLogin });

        this.refreshRowData();
      });

    // клик вне выделямых ячеек в строке
    this.listenFuncMousedown = this.renderer.listen('document', 'mousedown', (event) => {

      if (!this.eref.nativeElement.contains(event.target) && this.clickCount === 1) {
        this.removeSelection();
      }
    });
  }

  // проверка на выходной день
  dayOff(day: number): boolean {
    return (day === 0 || day === 6);
  }

  // проверка на воскресенье
  sunday(day: number): boolean {
    return day === 0;
  }

  // обновить данные Рабочего графика для сотрудника
  refreshRowData(): void {
    this.rowData = [];

    for (let i = 0; i < this.daysInMonth.length; i++) {
      const item: IRowData = {
        dayInWeekNumber: this.daysInMonth[i].number,
        dayCause: '',
        dayAbsence: false,
        daySelected: false
      };
      this.rowData.push(item);

      this._createWorkplan(i, this.rowData[i], this.user);
    }
  }

  // выделить ячейки при наведении
  selectCell($event: Event, dayIndex: number): void {
    // console.log('$event = ', $event, 'target = ', $event.target, 'current = ', $event.currentTarget);
    const elementLine = ($event.currentTarget as HTMLTextAreaElement).parentElement;
    let maxNumber = null;

    // если выделение начато
    if (elementLine.classList.contains('selected-row')) {

      // снять выделение со всех ячеек
      for (const item of this.rowData) {
        item.daySelected = false;
      }

      // выделение правее первой выделенной ячейки
      if (this.startActiveCellIndex <= dayIndex) {
        this.endCellIndex = dayIndex;
        this.startCellIndex = this.startActiveCellIndex;

        for (let i = this.startActiveCellIndex; i <= dayIndex; i++) {
          if (this.rowData[i].dayAbsence) {
            maxNumber = i;
          }

          if (maxNumber === null || i < maxNumber) {
            this.rowData[i].daySelected = true;
          } else {
            this.rowData[i].daySelected = false;
          }
        }
      }

      // выделение левее первой выделенной ячейки
      if (this.startActiveCellIndex >= dayIndex) {
        this.endCellIndex = this.startActiveCellIndex;
        this.startCellIndex = dayIndex;

        for (let i = this.startActiveCellIndex; i >= dayIndex; i--) {
          if (this.rowData[i].dayAbsence) {
            maxNumber = i;
          }

          if (maxNumber === null || i > maxNumber) {
            this.rowData[i].daySelected = true;
          } else {
            this.rowData[i].daySelected = false;
          }
        }
      }
    }
  }

  // изменить табель
  changeWorkplan($event: Event, dayIndex: number, day: IRowData): void {
    const elementDay = ($event.currentTarget as HTMLTextAreaElement);

    if (this.clickCount < 2) {
      this.clickCount++;
    } else {
      this.clickCount = 1;
    }

    const formattedNumber = ('0' + (dayIndex + 1)).slice(-2);
    const cellDate = this.selectedDate.year + '-' + this.selectedDate.month.number + '-' + formattedNumber;
    const cellAbsence = elementDay.classList.contains('absence');

    // обработка кликов
    switch (this.clickCount) {
      case 1:
        // если кликнули по ячейке с "неявкой"
        if (cellAbsence) {
          this.removeSelection();

          for (const absence of this.user.absence) {
            const dStart = absence.dateOfBeginning;
            const dEnd = absence.dateOfClosing;

            if (cellDate >= dStart && cellDate <= dEnd) {
              this.model = {
                unid: absence.unid,
                login: this.user.login,
                editDate: {
                  startDate: absence.dateOfBeginning,
                  endDate: absence.dateOfClosing,
                },
                cause: absence.cause
              };
            }
          }
          // начальная дата редактируемого периода
          this.startDateEditing = this.model.editDate.startDate;
          this.showAbsencePanel($event, true);
        } else {
          // если кликнули по обычной ячейке
          this.startActiveCellIndex = dayIndex;
          this.renderer.addClass(this.lineElement, 'selected-row');
          day.daySelected = true;
          this.renderer.addClass(elementDay, 'selected-start');
        }
        break;

      case 2:
        // если кликнули по ячейке с "неявкой" или по ячейке, которая находится в диапазоне с неявкой
        if (cellAbsence || !day.daySelected) {
          this.clickCount = 1;
        } else {
          // если кликнули по обычной ячейке
          let formattedStart = null;
          let formattedEnd = null;

          // если второй раз кликнули по той же ячейке, что и первый раз
          if (this.startActiveCellIndex === dayIndex) {
            formattedStart = ('0' + (dayIndex + 1)).slice(-2);
            formattedEnd = ('0' + (dayIndex + 1)).slice(-2);
          } else {
            formattedStart = ('0' + (this.startCellIndex + 1)).slice(-2);
            formattedEnd = ('0' + (this.endCellIndex + 1)).slice(-2);
          }

          this.model.editDate.startDate = this.selectedDate.year + '-' + this.selectedDate.month.number + '-' + formattedStart;
          this.model.editDate.endDate = this.selectedDate.year + '-' + this.selectedDate.month.number + '-' + formattedEnd;
          this.model.login = this.user.login;

          this.renderer.addClass(elementDay, 'selected-start');
          this.showAbsencePanel($event, false);
        }
        break;
    }
  }

  // снять выделение с ячеек
  removeSelection(): void {
    this.clickCount = 0;
    this.startActiveCellIndex = null;
    this.startCellIndex = null;
    this.endCellIndex = null;
    this.startDateEditing = null;

    this.renderer.removeClass(this.lineElement, 'selected-row');

    const selectedStartDayEl: NodeList = this.eref.nativeElement.querySelectorAll('.selected-start');
    if (selectedStartDayEl && selectedStartDayEl.length > 0) {
      _.each(selectedStartDayEl, (el) => {
        this.renderer.removeClass(el, 'selected-start');
      });
    }

    for (const item of this.rowData) {
      item.daySelected = false;
    }

    this.model = {
      unid: null,
      login: null,
      editDate: {
        startDate: null,
        endDate: null,
      },
      cause: null
    };
  }

  // Всплывающее окно для заполнения причины и периода отсутствия
  showAbsencePanel(event: any, editing: boolean): void {
    const overlayOrigin: ElementRef = event.target;

    const panelData: IAbsencePanelData = {
      overlayOrigin,
      causeList: this.causeList,
      cause: this.model.cause,
      editDate: this.model.editDate,
      editing
    };

    const absenceRef = this.absenceService.open(overlayOrigin, { data: panelData });

    // после закрытия панели
    absenceRef.afterClosed()
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        if (result) {
          const rangeDate = {
            startDate: moment(result.editDate.startDate).format('YYYY-MM-DD'),
            endDate: moment(result.editDate.endDate).format('YYYY-MM-DD')
          };

          this.model.editDate = rangeDate;
          this.model.cause = result.cause;

          this.saveAbsence(result.act);
        } else {
          this.removeSelection();
        }
      });

    // обновить позицию панели
    setTimeout(() => {
      this.absenceService.updatePosition(overlayOrigin);
    }, 400);
  }

  // сохранить данные о неявке
  saveAbsence(act: string): void {
    const data: WorkplanRowModel = {
      login: this.model.login,
      editDate: this.model.editDate,
      cause: this.model.cause
    };

    if (!this.user.absence) {
      this.user.absence = [];
    }

    switch (act) {
      // создание новой неявки
      case 'create':
        this.workplanService.sendRequest({ rowModel: data, act} )
          .pipe(takeUntil(this.destroyed))
          .subscribe((res: any) => {
            if (res.success) {
              const newAbsence = {
                unid: res.unid,
                dateOfBeginning: this.model.editDate.startDate,
                dateOfClosing: this.model.editDate.endDate,
                cause: this.model.cause,
              };

              this.user.absence.push(newAbsence);
              this.refreshRowData();
              this.removeSelection();
            }
          });
        break;

      // редактирование существующей неявки
      case 'edit':
        data.unid = this.model.unid;

        this.workplanService.sendRequest({ rowModel: data, act })
          .pipe(takeUntil(this.destroyed))
          .subscribe((res: any) => {
            if (res.success) {
              const startDateAbsence = this.startDateEditing;

              const newAbsence = {
                unid: this.model.unid,
                dateOfBeginning: this.model.editDate.startDate,
                dateOfClosing: this.model.editDate.endDate,
                cause: this.model.cause,
              };

              for (let i = 0; i < this.user.absence.length; i++) {
                const dStart = this.user.absence[i].dateOfBeginning;

                if (moment(startDateAbsence).isSame(moment(dStart))) {
                  this.user.absence.splice(i, 1);
                }
              }

              this.user.absence.push(newAbsence);
              this.refreshRowData();
              this.removeSelection();
            }
          });
        break;

      // удаление неявки
      case 'delete':
        data.unid = this.model.unid;

        this.workplanService.sendRequest({ rowModel: data, act })
          .pipe(takeUntil(this.destroyed))
          .subscribe((res: any) => {
            if (res.success) {
              const startDateAbsence = this.model.editDate.startDate;
              for (let i = 0; i < this.user.absence.length; i++) {
                const dStart = this.user.absence[i].dateOfBeginning;

                if (moment(startDateAbsence).isSame(moment(dStart))) {
                  this.user.absence.splice(i, 1);
                }
              }
              this.refreshRowData();
              this.removeSelection();
            }
          });
        break;
    }
  }

  ngOnDestroy() {
    // this.destroyed.next(null);
    // this.destroyed.complete();

    this.listenFuncMousedown();
  }



  // заполнение табеля по умолчанию (рабочие и выходные дни согласно календаря)
  private _defaultWorkplan(day: number): string {
    return this.dayOff(day) ? 'в' : 'р';
  }

  // заполнить табель для сотрудника
  private _createWorkplan(dayNumber: number, day: IRowData, user: WorkplanUser): void {
    const dayInWeekNumber = day.dayInWeekNumber;
    const formattedNumber = ('0' + (dayNumber + 1)).slice(-2);
    const cellDate = this.selectedDate.year + '-' + this.selectedDate.month.number + '-' + formattedNumber;

    // если неявка
    if (user && 'absence' in user && user.absence.length > 0) {
      for (const absence of user.absence) {
        const dStart = absence.dateOfBeginning;
        const dEnd = absence.dateOfClosing;
        const findedRecord: DictionaryRecord = _.findWhere(this.causeList, { key: absence.cause });
        const cause = findedRecord ? findedRecord.shortValue : '';

        if (!day.dayAbsence) {
          if (cellDate >= dStart && cellDate <= dEnd) {
            day.dayCause = cause;
            day.dayAbsence = true;
          } else {
            day.dayCause = this._defaultWorkplan(dayInWeekNumber);
          }
        }
      }
    } else {
      // если обычный день
      day.dayCause = this._defaultWorkplan(dayInWeekNumber);
    }
  }

}
