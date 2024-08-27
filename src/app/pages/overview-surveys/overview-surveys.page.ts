import { Component, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { Survey } from 'src/app/services/data.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'overview-surveys',
  templateUrl: './overview-surveys.page.html',
  styleUrls: ['./overview-surveys.page.scss'],
})
export class OverviewSurveysPage implements OnInit {

  surveys: Survey[] = [];  // Array zum Speichern der Umfragen

  constructor(private updateService: UpdateService, private surveysService: SurveysService) {}

  ngOnInit() {
    this.loadSurveys();
  }

  refresh(ev: RefresherCustomEvent) {
    setTimeout(async () => {
      await this.loadSurveys();  // Stelle sicher, dass Umfragen beim Refresh neu geladen werden
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  async loadSurveys() {
    await this.updateService.getSurveys();  // Daten abrufen und speichern
    this.surveys = await this.surveysService.loadSurveys();  // Daten aus dem Speicher laden
    console.log('Loaded surveys:', this.surveys);  // Ausgabe zur Überprüfung
  }
}
