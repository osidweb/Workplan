import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Department } from '../common/interfaces/department';

@Component({
  selector: 'app-workplan',
  templateUrl: './workplan.component.html',
  styleUrls: ['./workplan.component.scss']
})
export class WorkplanComponent implements OnInit, OnDestroy {
  private destroyed = new Subject();
  isMobile = false;

  // счетчик выбранного месяца
  monthCounter = 0;

  // список отделов
  departmentList: Department[] = [
    { key: '1', value: 'Директорат и бухгалтерия' },
    { key: '2', value: 'Отдел разработки 1С' },
    { key: '3', value: 'Отдел продаж' }
  ];
  // выбранный отдел
  selectedDepartment: Department;

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    const BP = { Small: '(max-width: 767px)' };
    this.breakpointObserver.observe([
      BP.Small
    ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        this.isMobile = result.matches ? true : false;
      });
  }

  ngOnInit() {
    this.selectedDepartment = this.departmentList[0];

  }

  ngOnDestroy() {
    this.destroyed.next(null);
    this.destroyed.complete();
  }

}
