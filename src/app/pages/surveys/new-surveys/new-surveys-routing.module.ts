import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewSurveysPage } from './new-surveys.page';

const routes: Routes = [
  {
    path: '',
    component: NewSurveysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewSurveysPageRoutingModule {}
