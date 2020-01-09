import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material';

import { WorkplanComponent } from './workplan.component';



@NgModule({
  declarations: [
    WorkplanComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule
  ],
  exports: [
    WorkplanComponent
  ]
})
export class WorkplanModule { }
