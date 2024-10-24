import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewSurveysPageRoutingModule } from './new-surveys-routing.module';

import { NewSurveysPage } from './new-surveys.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewSurveysPageRoutingModule
  ],
  declarations: []
})
export class NewSurveysPageModule {}
