import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
    private workplanService: WorkplanService
  ) { }

  ngOnInit() {
    this.workplanService.workplanDataChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe((wpData: WorkplanRowData) => {
        this.selectedDate = wpData.selectedDate;
        this.daysInMonth = wpData.daysInMonth;
        this.user = _.findWhere(wpData.users, { login: this.userLogin });

        // console.log('selectedDate = ', this.selectedDate, 'daysInMonth = ', this.daysInMonth, 'user = ', this.user);

        this.refreshRowData();
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

  ngOnDestroy() {
    this.destroyed.next(null);
    this.destroyed.complete();
  }



  // заполнение табеля по умолчанию (рабочие и выходные дни согласно календаря)
  _defaultWorkplan(day: number): string {
    return this.dayOff(day) ? 'в' : 'р';
  }

  // заполнить табель для сотрудника
  _createWorkplan(dayNumber: number, day: IRowData, user: WorkplanUser): void {
    const dayInWeekNumber = day.dayInWeekNumber;
    const formattedNumber = ('0' + (dayNumber + 1)).slice(-2);
    const cellDate = this.selectedDate.year + '-' + this.selectedDate.month.number + '-' + formattedNumber;

    // если неявка
    if (user && 'absence' in user && user.absence.length > 0) {
      for (const absence of user.absence) {
        const dStart = absence.dateOfBeginning;
        const dEnd = absence.dateOfClosing;
        const cause = absence.cause;

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
