import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrentSurveysPage } from './current-surveys.page';

const routes: Routes = [
  {
    path: '',
    component: CurrentSurveysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrentSurveysPageRoutingModule {}
