import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSelectModule, MatButtonModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { AbsencePanelComponent } from './absence-panel/absence-panel.component';
import { AbsenceService } from '../absence.service';



@NgModule({
  declarations: [
    AbsencePanelComponent
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot()
  ],
  exports: [
    AbsencePanelComponent
  ],
  entryComponents: [
    AbsencePanelComponent
  ],
  providers: [
    AbsenceService
  ]
})
export class AbsenceModule { }
