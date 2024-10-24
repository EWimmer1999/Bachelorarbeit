import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiaryEntryDetailPage } from './diary-entry-detail.page';

const routes: Routes = [
  {
    path: '',
    component: DiaryEntryDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiaryEntryDetailPageRoutingModule {}
