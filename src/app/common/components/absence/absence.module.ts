import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSelectModule, MatButtonModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AbsencePanelComponent } from './absence-panel/absence-panel.component';
import { AbsenceService } from './absence.service';
import { DaterangeInlineModule } from '../daterange-inline/daterange-inline.module';



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
    DaterangeInlineModule
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
