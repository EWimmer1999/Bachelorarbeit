import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewDiaryPageRoutingModule } from './new-diary-routing.module';

import { NewDiaryPage } from './new-diary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewDiaryPageRoutingModule
  ],
  declarations: [NewDiaryPage]
})
export class NewDiaryPageModule {}
