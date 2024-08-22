import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TippsPageRoutingModule } from './tipps-routing.module';

import { TippsPage } from './tipps.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TippsPageRoutingModule
  ],
  declarations: [TippsPage]
})
export class TippsPageModule {}
