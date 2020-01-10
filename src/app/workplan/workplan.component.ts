import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, forkJoin } from 'rxjs';
import * as moment from 'moment';
import { _ } from 'underscore';

import { DictionaryRecord } from '../common/interfaces/dictionary_record';
import { SelectedData } from '../common/interfaces/selected_data';
import { DayOfWeek } from '../common/interfaces/day_of_week';
import { WorkplanUser } from '../common/interfaces/workplan-user';
import { DictionaryService } from '../common/services/dictionary.service';
import { WorkplanService } from '../common/services/workplan.service';

@Component({
  selector: 'app-workplan',
  templateUrl: './workplan.component.html',
  styleUrls: ['./workplan.component.scss']
})
export class WorkplanComponent implements OnInit, OnDestroy {
  private destroyed = new Subject();
  isMobile = false;

  // расшифровка сокращений
  deciphermentOfAbbreviations: string[] = [
    'р — рабочий', 'в — выходной', 'о — отпуск', 'к - командировка'
  ];

  // счетчик выбранного месяца
  monthCounter = 0;

  // список сокращенных названий дней недели (от 'пн' до 'вс')
  weekArray: string[];
  // день недели
  daysArray: DayOfWeek[];

  // список отделов
  departmentList: DictionaryRecord[] = [];

  // выбранный отдел и дата
  select: SelectedData;
  sdate: string;

  // информация о выбранной дате
  dateInformation: any;

  // список сотрудников
  usersList: WorkplanUser[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private dictionaryService: DictionaryService,
    private workplanService: WorkplanService
  ) {
    const BP = { Small: '(max-width: 767px)' };
    this.breakpointObserver.observe([
      BP.Small
    ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        this.isMobile = result.matches ? true : false;
      });

    this.iconRegistry.addSvgIconSetInNamespace
      ('workplan', this.sanitizer.bypassSecurityTrustResourceUrl('assets/svg_icons/svg_sprite_workplan.svg'));
  }

  ngOnInit() {
    this.weekArray = moment.weekdaysShort();
    this.weekArray.splice(6, 0, this.weekArray.splice(0, 1)[0]);
    console.log('weekArray = ', this.weekArray);

    // получить выбранный отдел и дату, заполнить календарь
    forkJoin(
      this.dictionaryService.getDictionary({type: 'department'}),
      this._getSelectedDate(this.monthCounter)
    )
      .pipe(takeUntil(this.destroyed))
      .subscribe(([departmentDictionary, selectedDate]) => {
        this.departmentList = departmentDictionary.records;

        this.select = {
          department: this.departmentList[0].key,
          date: selectedDate
        };
        console.log('отдел и дата: ', this.select);

        this.sdate = selectedDate.format('MM-YYYY');

        this._getUsers(this.select.department, this.sdate);
        this._createCalendar();
      });
  }

  ngOnDestroy() {
    this.destroyed.next(null);
    this.destroyed.complete();
  }

  // показать График за предыдущую дату
  showPrevDate(): void {
    this.monthCounter--;
    this._showWorkplan(this.monthCounter, false);
  }

  // показать График за следующую дату
  showNextDate(): void {
    this.monthCounter++;
    this._showWorkplan(this.monthCounter, false);
  }



  // ПОЛУЧИТЬ ВЫБРАННУЮ ДАТУ (текущая дата, скорректированная на счетчик месяца)
  _getSelectedDate(mCounter: number): Observable<moment.Moment> {
    let currDate: moment.Moment = null;

    return new Observable((observer) => {
      if (mCounter !== 0) {
        currDate = moment().add(mCounter, 'months');

        this.dateInformation = {
          firstDay: {
            shortName: moment().add(mCounter, 'months').startOf('month').format('dd'),
            involCalendarFormat: moment().add(mCounter, 'months').startOf('month').format('ddd D.M')
          },
          month: {
            number: moment().add(mCounter, 'months').format('MM'),
            name: moment().add(mCounter, 'months').format('MMMM YYYY'),
            numberOfDays: moment().add(mCounter, 'months').daysInMonth()
          },
          year: moment().add(mCounter, 'months').format('YYYY')
        };
      } else {
        currDate = moment();

        this.dateInformation = {
          firstDay: {
            shortName: moment().startOf('month').format('dd'),
            involCalendarFormat: moment().startOf('month').format('ddd D.M')
          },
          month: {
            number: moment().format('MM'),
            name: moment().format('MMMM YYYY'),
            numberOfDays: moment().daysInMonth()
          },
          year: moment().format('YYYY')
        };
      }

      observer.next(currDate);
      observer.complete();
    });
  }

  // ПОЛУЧИТЬ СОТРУДНИКОВ ПО ОТДЕЛУ ЗА ПЕРИОД
  _getUsers(department: string, date: string) {
    this.workplanService.getUsers({ department, date })
      .pipe(takeUntil(this.destroyed))
      .subscribe((res: WorkplanUser[]) => {
        this.usersList = res;
      });
  }

  // ЗАПОЛНИТЬ КАЛЕНДАРЬ НА МЕСЯЦ: номера и названия дней недели
  // (для экранов 768px и более)
  _createCalendar(): void {
    let indexShortName = this.weekArray.indexOf(this.dateInformation.firstDay.shortName);
    this.daysArray = [];

    // заполнить массив с днями недели для сотрудника на месяц
    if (indexShortName > -1) {
      for (let i = 0; i < this.dateInformation.month.numberOfDays; i++) {
        const item: DayOfWeek = {};

        item.shortName = this.weekArray[indexShortName++];

        if (indexShortName === 7) { indexShortName = 0; }

        item.number = indexShortName;
        this.daysArray.push(item);
      }
    }
  }

  // ПОКАЗАТЬ ГРАФИК ЗА ДАТУ
  _showWorkplan(mCount, isMobile) {
    this._getSelectedDate(mCount)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {

        this.select.date = res;

        this.sdate = res.format('MM-YYYY');
        // this.getUsers(this.select.department, this.sdate);
        if (!isMobile) {
          this._createCalendar();
        }
      });
  }

}
