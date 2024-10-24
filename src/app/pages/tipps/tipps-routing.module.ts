import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TippsPage } from './tipps.page';

const routes: Routes = [
  {
    path: '',
    component: TippsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TippsPageRoutingModule {}
