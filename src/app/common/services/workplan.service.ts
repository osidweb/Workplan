import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { _ } from 'underscore';
import * as moment from 'moment';

import { WorkplanUser } from '../interfaces/workplan-user';
import { WorkplanRowData } from '../interfaces/workplan-row-data';
import { WorkplanRowModel } from '../interfaces/workplan-row-model';

@Injectable({
  providedIn: 'root'
})
export class WorkplanService {
  dateBegin = moment().startOf('month').add(2, 'days').format('YYYY-MM-DD');
  dateClose = moment().startOf('month').add(8, 'days').format('YYYY-MM-DD');

  users: any = [
    {
      department: '1',
      users: [
        { login: 'iivanov1972', name: 'Иванов Иван', workgroup: 'Генеральный директор', employmentDate: '2000-01-01' },
        { login: 'epetrova1970', name: 'Петрова Екатерина', workgroup: 'Бухгалтер', employmentDate: '2005-01-01' },
        { login: 'ekruglova1975', name: 'Круглова Елена', workgroup: 'Финансовый директор', employmentDate: '2000-02-01',
          absence: [
            { unid: '15749309175DDF89E55E3F1157494040', dateOfBeginning: this.dateBegin, dateOfClosing: this.dateClose, cause: 'k' }
          ]
        },
        { login: 'vnikitina1978', name: 'Никитина Виктория', workgroup: 'Коммерческий директор', employmentDate: '2000-03-01' }
      ]
    },
    {
      department: '2',
      users: [
        { login: 'ozaharov1990', name: 'Захаров Олег', workgroup: 'Дизайнер', employmentDate: '2005-02-01' },
        { login: 'nmihailov3319', name: 'Михайлов Никита', workgroup: 'FrontEnd разработчик', employmentDate: '2019-02-01' },
        { login: 'kmorozov1983', name: 'Морозов Кирилл', workgroup: 'Портал девлид', employmentDate: '2004-05-01' },
        { login: 'dalekseev1985', name: 'Алексеев Дмитрий', workgroup: 'PHP программист', employmentDate: '2005-09-01' },
        { login: 'ivolkov1987', name: 'Волков Илья', workgroup: 'PHP программист', employmentDate: '2007-08-01' },
        { login: 'osidorova1980', name: 'Сидорова Оксана', workgroup: 'FrontEnd разработчик', employmentDate: '2017-07-11',
          absence: [
            { unid: '15749309175DDF89E55E3F1157493091', dateOfBeginning: this.dateBegin, dateOfClosing: this.dateClose, cause: 'o' }
          ]
        },
        { login: 'vegorov1989', name: 'Егоров Валерий', workgroup: 'PHP программист', employmentDate: '2020-01-01' }
      ]
    },
    {
      department: '3',
      users: [
        { login: 'apavlova1983', name: 'Павлова Алия', workgroup: 'Менеджер по продажам', employmentDate: '2005-02-01',
          absence: [
            { unid: '15749309175DDF89E55E3F1157495050', dateOfBeginning: this.dateBegin, dateOfClosing: this.dateClose, cause: 'b' }
          ]
        },
        { login: 'akozlova17519', name: 'Козлова Анастасия', workgroup: 'Менеджер по продажам', employmentDate: '2015-02-01' },
        { login: 'nstepanova25719', name: 'Степанова Наталья',  workgroup: 'Менеджер по продажам', employmentDate: '2012-03-11' },
        { login: 'msokolova12919', name: 'Соколова Марина', workgroup: 'Менеджер по продажам', employmentDate: '2005-05-21' },
        { login: 'korlova51119', name: 'Орлова Кристина',  workgroup: 'Менеджер по продажам', employmentDate: '2016-04-15' }
      ]
    }
  ];

  // для подписки на изменение workplanRowData в разных несвязанных компонентах
  // объект, содержащий текущее значение workplanRowData
  private workplanDataSource = new BehaviorSubject({});
  // подписка на изменение значения workplanRowData
  workplanDataChanges = this.workplanDataSource.asObservable();

  constructor() { }

  // перезаписать текущее значение workplanRowData на измененное
  changeWorkplanData(data: WorkplanRowData): void {
    this.workplanDataSource.next(data);
  }

  // имитация запроса в базу на получение списка сотрудников по отделу за дату
  // передаем выбранный отдел и дату (месяц)
  getUsers(data: { department: string, date: string }): Observable<WorkplanUser[]> {
    // здесь должно быть обращение к серверу
    const response = _.findWhere(this.users, { department: data.department });
    const result: WorkplanUser[] = response ? response.users : [];

    return new Observable((observer) => {
      observer.next(result);
      observer.complete();
    });
  }

  // имитация запроса в базу на сохранение данных о неявке
  // передаем данные о неявке и название действия ('delete'/'create'/'edit')
  sendRequest(data: { rowModel: WorkplanRowModel, act: string }): Observable<any> {
    // здесь должно быть обращение к серверу
    const response = {
      data: {
        success: true,
        unid: '12345678910'
      }
    };
    const result = response.data;

    return new Observable((observer) => {
      observer.next(result);
      observer.complete();
    });
  }
}
