import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverviewSurveysPageRoutingModule } from './overview-surveys-routing.module';

import { OverviewSurveysPage } from './overview-surveys.page';
import { SurveyComponentModule } from 'src/app/components/survey/survey.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SurveyComponentModule,
    OverviewSurveysPageRoutingModule
  ],
  declarations: [OverviewSurveysPage]
})
export class OverviewSurveysPageModule {}
