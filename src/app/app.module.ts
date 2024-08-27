import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Storage } from '@ionic/storage-angular'


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OverviewSurveysPage } from './pages/overview-surveys/overview-surveys.page';
import { CompletedSurveysPage } from './pages/surveys/completed-surveys/completed-surveys.page';
import { NewSurveysPage } from './pages/surveys/new-surveys/new-surveys.page';

@NgModule({
  declarations: [AppComponent,
    OverviewSurveysPage,
    NewSurveysPage,
    CompletedSurveysPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Storage, provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})

export class AppModule {}
