import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditEntryPage } from './edit-entry.page';

const routes: Routes = [
  {
    path: '',
    component: EditEntryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditEntryPageRoutingModule {}
