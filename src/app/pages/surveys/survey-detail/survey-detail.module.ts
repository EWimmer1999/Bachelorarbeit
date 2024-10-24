import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyDetailPageRoutingModule } from './survey-detail-routing.module';

import { SurveyDetailPage } from './survey-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SurveyDetailPageRoutingModule
  ],
  declarations: [SurveyDetailPage]
})
export class SurveyDetailPageModule {}
