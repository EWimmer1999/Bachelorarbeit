import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedSurveyDetailPageRoutingModule } from './completed-survey-detail-routing.module';

import { CompletedSurveyDetailPage } from './completed-survey-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedSurveyDetailPageRoutingModule
  ],
  declarations: [CompletedSurveyDetailPage]
})
export class CompletedSurveyDetailPageModule {}
