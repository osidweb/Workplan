import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { _ } from 'underscore';

import { WorkplanRowPrototypeComponent } from '../workplan-row-prototype/workplan-row-prototype.component';
import { WorkplanService } from 'src/app/common/services/workplan.service';
import { AbsenceService, IAbsencePanelData } from 'src/app/common/components/absence/absence.service';
import { WorkplanRowData } from 'src/app/common/interfaces/workplan-row-data';
import { WorkplanUser } from 'src/app/common/interfaces/workplan-user';
import { WorkplanRowModel } from 'src/app/common/interfaces/workplan-row-model';

interface IRowData {
  number: number;
  selectedMonth: boolean;
  absence: boolean;
  cause: string | null;
  absenceStart: boolean;
  absenceNumber: number | null;
  absenceLength: string | null;
  date: string | null;
  selected?: boolean;
  selectedStart?: boolean;
  selectedEnd?: boolean;
}

@Component({
  selector: 'app-workplan-row-mobile',
  templateUrl: './workplan-row-mobile.component.html',
  styleUrls: ['./workplan-row-mobile.component.scss']
})
export class WorkplanRowMobileComponent extends WorkplanRowPrototypeComponent implements OnInit {
  dateInfo: any;
  rowData: IRowData[][] = [];

  startClickCell: IRowData = null;
  endClickCell: IRowData = null;
  startDate: string = null;
  endDate: string = null;

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

    // подписка на изменения даты/сотрудников
    this.workplanService.workplanDataChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe((wpData: WorkplanRowData) => {
        this.selectedDate = wpData.selectedDate;
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

  // обновить данные Рабочего графика для сотрудника
  refreshRowData(): void {
    const date = moment(this.selectedDate.momentDate, 'YYYY-MM-DD');

    // информация о выбранной дате
    this.dateInfo = {
      daysInMonth: date.daysInMonth(),
      monthNumber: date.format('MM'),
      year: date.format('YYYY'),
      firstDay: {
        inWeekNumber: this._getDayNumber(date.startOf('month')),
        involCalendarFormat: date.startOf('month').format('ddd D.M')
      },
      lastDay: {
        inWeekNumber: this._getDayNumber(date.endOf('month'))
      },
      prevMonth: {
        daysInMonth: date.subtract(1, 'months').daysInMonth()
      }
    };

    this._createCalendar();
  }

  // снять выделение с ячеек
  removeSelection(): void {
    this.clickCount = 0;
    this.startClickCell = null;
    this.endClickCell = null;
    this.startDate = null;
    this.endDate = null;

    for (const rd of this.rowData) {
      for (const item of rd) {
        item.selected = false;
        item.selectedStart = false;
        item.selectedEnd = false;
      }
    }

    this.model = {
      unid: null,
      login: null,
      editDate: {
        startDate: null,
        endDate: null,
      },
      cause: null,
    };
  }

  // изменить табель
  changeWorkplan(event: any, day: IRowData): void {
    if (this.clickCount < 2) {
      this.clickCount++;
    } else {
      this.clickCount = 1;
    }

    const cellAbsence = event.target.classList.contains('absence');
    console.log('changeWorkplan: cellAbsence = ', cellAbsence, 'this.clickCount = ', this.clickCount);

    // обработка кликов
    switch (this.clickCount) {
      case 1:
        // если кликнули по ячейке с "неявкой"
        if (cellAbsence) {
          this.removeSelection();

          this.model = {
            unid: this.user.absence[day.absenceNumber].unid,
            login: this.user.login,
            editDate: {
              startDate: this.user.absence[day.absenceNumber].dateOfBeginning,
              endDate: this.user.absence[day.absenceNumber].dateOfClosing,
            },
            cause: this.user.absence[day.absenceNumber].cause
          };

          // выделить дни неявки
          // получить все дни неявки, которую выделили
          for (const rdItem of this.rowData) {
            const searchFirstDayAbsence = _.findWhere(rdItem, { date: this.model.editDate.startDate });
            if (searchFirstDayAbsence) {
              searchFirstDayAbsence.selectedStart = true;
            }

            const searchLastDayAbsence = _.findWhere(rdItem, { date: this.model.editDate.endDate });
            if (searchLastDayAbsence) {
              searchLastDayAbsence.selectedEnd = true;
            }

            const searchAllDaysAbsence = _.where(rdItem, { absence: true, absenceNumber: day.absenceNumber });
            for (const item of searchAllDaysAbsence) {
              item.selected = true;
            }
          }

          // показать окно для заполнения причины и периода отсутствия
          this.showAbsencePanel(event, true);
        } else {
          // если кликнули по обычной ячейке
          this.startClickCell = day;
          day.selectedStart = true;
        }
        break;

      case 2:
        // если кликнули по ячейке с "неявкой"
        if (cellAbsence) {
          this.clickCount = 1;
        } else {
          // если кликнули по обычной ячейке

          // если второй раз кликнули по той же ячейке, что и первый раз
          if (moment(this.startClickCell.date).isSame(moment(day.date))) {
            this.model.login = this.user.login;
            this.model.editDate.startDate = this.startClickCell.date;
            this.model.editDate.endDate = this.startClickCell.date;

            this.showAbsencePanel(event, false);
          } else {
            let notAbsence = true;
            this.endClickCell = day;

            // определить конечную и начальную дату предполагаемой неявки
            if (this.startClickCell.date < this.endClickCell.date) {
              this.startDate = this.startClickCell.date;
              this.endDate = this.endClickCell.date;
            } else {
              this.startDate = this.endClickCell.date;
              this.endDate = this.startClickCell.date;
            }

            // проверка: попала в выбранный период существующая неявка
            if (this.user && 'absence' in this.user && this.user.absence.length > 0) {
              for (const absence of this.user.absence) {
                if (absence.dateOfBeginning > this.startDate && absence.dateOfBeginning < this.endDate) {
                  notAbsence = false;
                  break;
                }
              }
            }

            // если в выбранный диапазон не попала неявка
            if (notAbsence) {
              day.selected = true;
              day.selectedEnd = true;
              for (const rdItem of this.rowData) {
                for (const item of rdItem) {
                  if (moment(item.date).isSame(moment(this.startDate))) {
                    item.selectedEnd = false;
                    item.selectedStart = true;
                  }
                  if (moment(item.date).isSame(moment(this.endDate))) {
                    item.selectedEnd = true;
                    item.selectedStart = false;
                  }
                  if (item.date >= this.startDate && item.date <= this.endDate) {
                    item.selected = true;
                  }
                }
              }

              this.model.login = this.user.login;
              this.model.editDate.startDate = this.startDate;
              this.model.editDate.endDate = this.endDate;

              this.showAbsencePanel(event, false);
            } else {
              this.clickCount = 1;
            }
          }
        }
        break;
    }
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

  // передать данные о неявках на сервер
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
        this.workplanService.sendRequest({ rowModel: data, act })
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
              const startDateAbsence = this.model.editDate.startDate;

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

  // установить ширину элемента с описанием неявки
  getStyle(quantity: number): number {
    // выбрать любую ячейку, чтобы определить ее ширину
    const calendarCell = this.eref.nativeElement.querySelector('.day');
    let widthSize = 0;

    if (calendarCell) {
      widthSize = calendarCell.getBoundingClientRect().width;
      widthSize = widthSize * quantity;
    }

    return widthSize;
  }



  // получить номер дня недели, от 0(пн) до 6(вс)
  private _getDayNumber(date: moment.Moment): number {
    let day = date.day();
    day = (day === 0) ? 7 : day;

    return day - 1;
  }

  // создать Календарь на месяц
  private _createCalendar(): void {
    this.rowData = [];
    let rowDataItem: IRowData[] = [];

    const dStart = moment(this.selectedDate.momentDate, 'YYYY-MM-DD').startOf('month');
    let count = 0;

    // заполнить первый ряд от понедельника
    // и до дня, с которого начинается месяц
    // если первый день недели выбранного месяца не понедельник
    if (this.dateInfo.firstDay.inWeekNumber !== 0) {
      for (let i = this.dateInfo.firstDay.inWeekNumber; i > 0; i--) {
        const item1: IRowData = {
          number: this.dateInfo.prevMonth.daysInMonth - (i - 1),
          selectedMonth: false,
          absence: false,
          cause: null,
          absenceStart: false,
          absenceNumber: null,
          absenceLength: null,
          date: null
        };

        const formattedNumber1 = ('0' + item1.number).slice(-2);
        const d1 = moment(this.selectedDate.momentDate, 'YYYY-MM-DD').startOf('month');
        const prevYM = d1.subtract(1, 'months').format('YYYY-MM');
        item1.date = prevYM + '-' + formattedNumber1;

        rowDataItem.push(item1);
      }
    }

    // заполнить ячейки с датами текущего месяца
    while (dStart.format('MM') === this.dateInfo.monthNumber) {
      const item2: IRowData = {
        number: parseInt(dStart.format('D'), 10),
        selectedMonth: true,
        absence: false,
        cause: null,
        absenceStart: false,
        absenceNumber: null,
        absenceLength: null,
        date: dStart.format('YYYY-MM-DD')
      };

      rowDataItem.push(item2);

      // вс, последний день - записать в объект
      if (this._getDayNumber(dStart) % 7 === 6) {
        this.rowData.push(rowDataItem);
        rowDataItem = [];
      }

      dStart.add(1, 'days');
    }

    // заполнить последний ряд до воскресенья
    if (this._getDayNumber(dStart) !== 0) {
      for (let j = this._getDayNumber(dStart); j < 7; j++) {
        count++;

        const item3: IRowData = {
          number: count,
          selectedMonth: false,
          absence: false,
          cause: null,
          absenceStart: false,
          absenceNumber: null,
          absenceLength: null,
          date: null
        };

        const formattedNumber3 = ('0' + item3.number).slice(-2);
        const d3 = moment(this.selectedDate.momentDate, 'YYYY-MM-DD').startOf('month');
        const nextYM = d3.add(1, 'months').format('YYYY-MM');
        item3.date = nextYM + '-' + formattedNumber3;

        rowDataItem.push(item3);
      }
      this.rowData.push(rowDataItem);
      rowDataItem = [];
    }

    // проставить неявки по дням
    for (const rd of this.rowData) {
      for (let l = 0; l < 7; l++) {
        this._createWorkplan(rd[l], this.user);
      }
    }

    // определить начало и длину неявки в каждой строке
    for (const rd of this.rowData) {
      // выбрать все дни с неявками
      const searchAllDaysAbsence = _.where(rd, { absence: true });
      // из дней с неявками выбрать первый день каждой неявки
      const searchFirstDaysAbsence = _.uniq(searchAllDaysAbsence, (a) => {
        return a.absenceNumber;
      });
      for (const fda of searchFirstDaysAbsence) {
        const index = _.findIndex(rd, fda);
        rd[index].absenceStart = true;

        // сгруппировать все дни с неявками по каждой неявке отдельно
        // чтобы посчитать количество дней в каждой неявке
        const filterCauseArr = _.where(rd, { absenceNumber: rd[index].absenceNumber, absence: true });
        rd[index].absenceLength = filterCauseArr.length;
      }
    }
  }

  // создать Рабочий график для сотрудника
  private _createWorkplan(day: IRowData, user: WorkplanUser): void {
    const cellDate = day.date;

    // если неявка
    if (user && 'absence' in user && user.absence.length > 0) {
      for (let i = 0; i < user.absence.length; i++) {
        const dStart = user.absence[i].dateOfBeginning;
        const dEnd = user.absence[i].dateOfClosing;
        const cause = user.absence[i].cause;

        if (!day.absence) {
          if (cellDate >= dStart && cellDate <= dEnd) {
            day.absence = true;
            const searchCause = _.findWhere(this.causeList, { key: cause });
            const defaultTextCause = 'Неявка';
            day.cause = searchCause ? searchCause.value : defaultTextCause;
            day.absenceNumber = i;
          }
        }
      }
    }
  }

}
