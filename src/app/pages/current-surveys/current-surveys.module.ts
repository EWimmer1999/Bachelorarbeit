import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrentSurveysPageRoutingModule } from './current-surveys-routing.module';

import { CurrentSurveysPage } from './current-surveys.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrentSurveysPageRoutingModule
  ],
  declarations: [CurrentSurveysPage]
})
export class CurrentSurveysPageModule {}
