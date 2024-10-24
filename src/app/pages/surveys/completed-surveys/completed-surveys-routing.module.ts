import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedSurveysPage } from './completed-surveys.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedSurveysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedSurveysPageRoutingModule {}
