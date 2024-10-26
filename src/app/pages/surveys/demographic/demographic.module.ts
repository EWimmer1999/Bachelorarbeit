import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemographicPageRoutingModule } from './demographic-routing.module';

import { DemographicPage } from './demographic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemographicPageRoutingModule
  ],
  declarations: [DemographicPage]
})
export class DemographicPageModule {}
