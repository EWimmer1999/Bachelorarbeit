import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedSurveysPageRoutingModule } from './completed-surveys-routing.module';

import { CompletedSurveysPage } from './completed-surveys.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedSurveysPageRoutingModule
  ],
  declarations: [CompletedSurveysPage]
})
export class CompletedSurveysPageModule {}
