import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoisemeterPageRoutingModule } from './noisemeter-routing.module';

import { NoisemeterPage } from './noisemeter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoisemeterPageRoutingModule
  ],
  declarations: [NoisemeterPage]
})
export class NoisemeterPageModule {}
