import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPWPage } from './new-pw.page';

const routes: Routes = [
  {
    path: '',
    component: NewPWPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPWPageRoutingModule {}
