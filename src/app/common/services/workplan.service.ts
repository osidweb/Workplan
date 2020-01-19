import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { _ } from 'underscore';
import * as moment from 'moment';

import { WorkplanUser } from '../interfaces/workplan-user';
import { WorkplanRowData } from '../interfaces/workplan-row-data';

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
        { login: 'SKukresh', name: 'Сергей Кукреш', firstName: 'Сергей', lastName: 'Кукреш', workgroup: 'Генеральный директор' },
        { login: 'echernysheva', name: 'Екатерина Чернышева', firstName: 'Екатерина', lastName: 'Чернышева', workgroup: 'Бухгалтер' },
        { login: 'easorgina', name: 'Елена Асоргина', firstName: 'Елена', lastName: 'Асоргина', workgroup: 'Финансовый директор',
          absence: [
            {
              unid: '15749309175DDF89E55E3F1157494040', dateOfBeginning: this.dateBegin, dateOfClosing: this.dateClose, cause: 'k'
            }
          ]
        },
        { login: 'vnagornaya', name: 'Виктория Нагорная', firstName: 'Виктория', lastName: 'Нагорная', workgroup: 'Коммерческий директор'}
      ]
    },
    {
      department: '2',
      users: [
        { login: 'otrofimov', name: 'Олег Трофимов', firstName: 'Олег', lastName: 'Трофимов', workgroup: 'Дизайнер' },
        { login: 'nezan3319', name: 'Никита Езан', firstName: 'Никита', lastName: 'Езан', workgroup: 'FrontEnd разработчик' },
        { login: 'kfedorov', name: 'Кирилл Федоров', firstName: 'Кирилл', lastName: 'Федоров', workgroup: 'Портал дев лид' },
        { login: 'ddudarev', name: 'Дмитрий Дударев', firstName: 'Дмитрий', lastName: 'Дударев', workgroup: 'PHP программист' },
        { login: 'igospadarev', name: 'Илья Госпадарев', firstName: 'Илья', lastName: 'Госпадарев', workgroup: 'PHP программист' },
        { login: 'osidorova', name: 'Оксана Сидорова', firstName: 'Оксана', lastName: 'Сидорова', workgroup: 'FrontEnd разработчик',
          absence: [
            {
              unid: '15749309175DDF89E55E3F1157493091', dateOfBeginning: this.dateBegin, dateOfClosing: this.dateClose, cause: 'o'
            }
          ]
        },
        { login: 'vkruglov', name: 'Валерий Круглов', firstName: 'Валерий', lastName: 'Круглов', workgroup: 'PHP программист' }
      ]
    },
    {
      department: '3',
      users: [
        { login: 'akroyshner', name: 'Алия Кройшнер', firstName: 'Алия', lastName: 'Кройшнер', workgroup: 'Менеджер по продажам',
          absence: [
            {
              unid: '15749309175DDF89E55E3F1157495050', dateOfBeginning: this.dateBegin, dateOfClosing: this.dateClose, cause: 'b'
            }
          ]
        },
        { login: 'akadurkina17519', name: 'Анастасия Кадуркина', firstName: 'Анастасия',
          lastName: 'Кадуркина', workgroup: 'Менеджер по продажам' },
        { login: 'nostanina25719', name: 'Наталья Останина', firstName: 'Наталья',
          lastName: 'Останина', workgroup: 'Менеджер по продажам' },
        { login: 'mkachmaz12919', name: 'Марина Качмаз', firstName: 'Марина', lastName: 'Качмаз', workgroup: 'Менеджер по продажам' },
        { login: 'ksoloveva51119', name: 'Кристина Соловьева', firstName: 'Кристина',
          lastName: 'Соловьева', workgroup: 'Менеджер по продажам' }
      ]
    }
  ];

  // для подписки на изменение workplanRowData в разных несвязанных компонентах
  // объект, содержащий текущее значение workplanRowData
  private workplanDataSource = new BehaviorSubject({});
  // подписка на изменение значения workplanRowData
  workplanDataChanges = this.workplanDataSource.asObservable();

  constructor() { }

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

  // перезаписать текущее значение workplanRowData на измененное
  changeWorkplanData(data: WorkplanRowData): void {
    this.workplanDataSource.next(data);
  }
}
