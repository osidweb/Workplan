import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'workplan';

  ngOnInit() {
    // установка локали для библиотеки moment.js
    moment.locale('ru');
  }
}
