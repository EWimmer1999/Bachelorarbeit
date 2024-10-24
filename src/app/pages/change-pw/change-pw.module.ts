import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePWPageRoutingModule } from './change-pw-routing.module';

import { ChangePWPage } from './change-pw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePWPageRoutingModule
  ],
  declarations: [ChangePWPage]
})
export class ChangePWPageModule {}
