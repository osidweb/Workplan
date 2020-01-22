import { Component, OnInit, Input, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

import { DictionaryRecord } from 'src/app/common/interfaces/dictionary-record';
import { WorkplanRowModel } from 'src/app/common/interfaces/workplan-row-model';
import { WorkplanService } from 'src/app/common/services/workplan.service';
import { AbsenceService } from 'src/app/common/components/absence/absence.service';
import { DayOfWeek } from 'src/app/common/interfaces/day-of-week';
import { WorkplanUser } from 'src/app/common/interfaces/workplan-user';

// export interface IRowData {
//   dayInWeekNumber: number;
//   dayCause: string;
//   dayAbsence: boolean;
//   daySelected: boolean;
// }

@Component({
  selector: 'app-workplan-row-prototype',
  templateUrl: './workplan-row-prototype.component.html',
  styleUrls: ['./workplan-row-prototype.component.scss']
})
export class WorkplanRowPrototypeComponent implements OnInit, OnDestroy {
  @Input() userLogin: string;
  @Input() causeList: DictionaryRecord[];

  destroyed = new Subject();

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
    cause: null
  };

  startDateEditing: string | null = null;
  startActiveCellIndex: number | null = null;
  startCellIndex: number | null = null;
  endCellIndex: number | null = null;

  // rowData: IRowData[] = [];

  constructor(
    protected eref: ElementRef,
    protected renderer: Renderer2,
    protected workplanService: WorkplanService,
    protected absenceService: AbsenceService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroyed.next(null);
    this.destroyed.complete();

    // this.listenFuncMousedown();
  }

}
