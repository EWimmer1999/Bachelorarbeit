import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewDiaryPage } from './new-diary.page';

const routes: Routes = [
  {
    path: '',
    component: NewDiaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewDiaryPageRoutingModule {}
