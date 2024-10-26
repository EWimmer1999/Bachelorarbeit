import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemographicPage } from './demographic.page';

const routes: Routes = [
  {
    path: '',
    component: DemographicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemographicPageRoutingModule {}
