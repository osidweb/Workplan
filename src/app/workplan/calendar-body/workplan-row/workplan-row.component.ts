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
import { IAbsencePanelData, AbsenceService } from 'src/app/common/components/absence.service';

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
export class WorkplanRowComponent implements OnInit, OnDestroy {
  @Input() userLogin: string;
  @Input() causeList: DictionaryRecord[];

  private destroyed = new Subject();
  listenFuncMousedown;

  // элемент обертка с классом 'line'
  lineElement: ElementRef;

  selectedDate: any;
  daysInMonth: DayOfWeek[];
  user: WorkplanUser;

  clickCount = 0;
  clickOutsideElement = false;

  model: WorkplanRowModel = {
    unid: null,
    login: null,
    editDate: {
      startDate: null,
      endDate: null,
    },
    cause: null,
    involvement: 0,
    deputyLogin: null
  };

  startDateEditing: string | null = null;
  startActiveCellIndex: number | null = null;
  startCellIndex: number | null = null;
  endCellIndex: number | null = null;

  rowData: IRowData[] = [];

  constructor(
    private eref: ElementRef,
    private renderer: Renderer2,
    private workplanService: WorkplanService,
    private absenceService: AbsenceService
  ) { }

  ngOnInit() {
    // получить элемент обертку с классом 'line'
    // this.lineElement = this.eref.nativeElement.children[0];
    // this.lineElement = this.renderer.nextSibling(this.eref.nativeElement);
    this.lineElement = this.eref.nativeElement.querySelector('.line');
    console.log('lineElement = ', this.lineElement);

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
        console.log('CLICK document = ', event.target);
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
      // for (let i = 0; i < this.rowData.length; i++) {
      //   this.rowData[i].daySelected = false;
      // }
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
    // const elementLine = elementDay.parentElement;
    // console.log('this.eref.nativeElement = ', this.eref.nativeElement);

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
                cause: absence.cause,
                involvement: absence.involvement,
                deputyLogin: absence.deputyLogin === null || absence.deputyLogin === ''
                  ? ''
                  : absence.deputyLogin
              };
            }
          }
          // начальная дата редактируемого периода
          this.startDateEditing = this.model.editDate.startDate;
          this.showAbsencePanel($event);
        } else {
          // если кликнули по обычной ячейке
          this.startActiveCellIndex = dayIndex;
          // elementLine.classList.add('selected-row');
          this.renderer.addClass(this.lineElement, 'selected-row');
          day.daySelected = true;
          // elementDay.classList.add('selected-start');
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

          // elementDay.classList.add('selected-start');
          this.renderer.addClass(elementDay, 'selected-start');
          // this.showChoiceOfCause($event);
          this.showAbsencePanel($event);
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

    console.log('this.lineElement = ', this.lineElement);
    console.log('this.eref.nativeElement.querySelector(".selected-start") = ', this.eref.nativeElement.querySelector('.selected-start'));
    const selectedStartDayEl = this.eref.nativeElement.querySelector('.selected-start');
    this.renderer.removeClass(this.lineElement, 'selected-row');
    if (selectedStartDayEl) {
      this.renderer.removeClass(this.eref.nativeElement.querySelector('.selected-start'), 'selected-start');
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
      cause: null,
      involvement: 0,
      deputyLogin: null
    };
  }

  // Всплывающее окно для заполнения % вовлеченности и заместителя
  showAbsencePanel(event) {
    const overlayOrigin: ElementRef = event.target;

    console.log('this.model = ', this.model);

    const panelData: IAbsencePanelData = {
      overlayOrigin,
      causeList: this.causeList,
      cause: this.model.cause,
      editDate: this.model.editDate
      // documentUnid: this.document.unid,
      // tags: this.document.Tags
    };

    const absenceRef = this.absenceService.open(overlayOrigin, { data: panelData });

    // после закрытия панели
    absenceRef.afterClosed()
      .subscribe(result => {
        if (result) {
          // this._applyTagsList(result);
        }
      });

    // обновить позицию панели
    setTimeout(() => {
      this.absenceService.updatePosition(overlayOrigin);
    }, 400);
  }

  // всплывающее окно выбор причины отсутствия
  showChoiceOfCause($event) {
    console.log('showChoiceOfCause');
  }

  ngOnDestroy() {
    this.destroyed.next(null);
    this.destroyed.complete();

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
