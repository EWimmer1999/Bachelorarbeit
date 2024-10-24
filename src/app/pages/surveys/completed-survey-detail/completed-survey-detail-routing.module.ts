import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedSurveyDetailPage } from './completed-survey-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedSurveyDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedSurveyDetailPageRoutingModule {}
