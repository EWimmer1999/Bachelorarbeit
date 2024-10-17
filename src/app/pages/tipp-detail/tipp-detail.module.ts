import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TippDetailPageRoutingModule } from './tipp-detail-routing.module';

import { TippDetailPage } from './tipp-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TippDetailPageRoutingModule
  ],
  declarations: [TippDetailPage]
})
export class TippDetailPageModule {}
