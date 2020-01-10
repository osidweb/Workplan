import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dictionary } from '../interfaces/dictionary';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  // имитация работы с сервером: словарь "Отделы"
  departmentDictionary: Dictionary = {
    type: 'department',
    records: [
      { key: '1', value: 'Директорат и бухгалтерия' },
      { key: '2', value: 'IT отдел' },
      { key: '3', value: 'Отдел продаж' }
    ]
  };

  constructor() { }

  // имитация запроса в базу на получение словаря
  // передаем тип словаря
  getDictionary(data: { type: string }): Observable<Dictionary> {
    // здесь должно быть обращение к серверу
    const response: Dictionary = this.departmentDictionary;

    return new Observable((observer) => {
      observer.next(response);
      observer.complete();
    });
  }
}
