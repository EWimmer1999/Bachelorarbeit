import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPWPageRoutingModule } from './new-pw-routing.module';

import { NewPWPage } from './new-pw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPWPageRoutingModule
  ],
  declarations: [NewPWPage]
})
export class NewPWPageModule {}
