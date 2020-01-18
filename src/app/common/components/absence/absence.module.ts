import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSelectModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    FormsModule,
    ReactiveFormsModule
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
