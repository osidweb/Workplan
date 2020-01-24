import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { DaterangeInlinePanelComponent } from './daterange-inline-panel/daterange-inline-panel.component';
import { DaterangeInlineService } from './daterange-inline.service';


@NgModule({
  declarations: [DaterangeInlinePanelComponent],
  imports: [
    CommonModule,
    NgxDaterangepickerMd.forRoot()
  ],
  exports: [
    DaterangeInlinePanelComponent
  ],
  entryComponents: [
    DaterangeInlinePanelComponent
  ],
  providers: [
    DaterangeInlineService
  ]
})
export class DaterangeInlineModule { }
