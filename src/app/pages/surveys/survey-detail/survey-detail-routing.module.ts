import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyDetailPage } from './survey-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SurveyDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyDetailPageRoutingModule {}
