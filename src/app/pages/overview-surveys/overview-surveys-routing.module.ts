import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewSurveysPage } from './overview-surveys.page';

const routes: Routes = [
  {
    path: '',
    component: OverviewSurveysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewSurveysPageRoutingModule {}
