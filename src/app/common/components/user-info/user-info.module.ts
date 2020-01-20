import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserInfoService } from './user-info.service';
import { UserInfoPanelComponent } from './user-info-panel/user-info-panel.component';



@NgModule({
  declarations: [UserInfoPanelComponent],
  imports: [
    CommonModule
  ],
  exports: [
    UserInfoPanelComponent
  ],
  entryComponents: [
    UserInfoPanelComponent
  ],
  providers: [
    UserInfoService
  ]
})
export class UserInfoModule { }
