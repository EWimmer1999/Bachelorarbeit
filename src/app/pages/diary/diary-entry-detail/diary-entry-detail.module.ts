import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaryEntryDetailPageRoutingModule } from './diary-entry-detail-routing.module';

import { DiaryEntryDetailPage } from './diary-entry-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiaryEntryDetailPageRoutingModule
  ],
  declarations: [DiaryEntryDetailPage]
})
export class DiaryEntryDetailPageModule {}
