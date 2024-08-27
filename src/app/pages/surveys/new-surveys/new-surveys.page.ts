import { Component, OnInit } from '@angular/core';
import { Survey } from 'src/app/services/data.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-new-surveys',
  templateUrl: './new-surveys.page.html',
  styleUrls: ['./new-surveys.page.scss'],
})

export class NewSurveysPage implements OnInit {

  surveys: Survey[] = [];

  constructor(private surveysService: SurveysService) { }

  async ngOnInit() {
    const allSurveys = await this.surveysService.loadSurveys();
    this.surveys = allSurveys.filter(survey => !survey.isCompleted);
  }

  async startSurvey(survey: Survey) {
    // Logik zum Starten der Umfrage
    // Setze die Umfrage nach Abschluss auf abgeschlossen
    await this.surveysService.markSurveyAsCompleted(survey);
    this.surveys = this.surveys.filter(s => s.id !== survey.id);  // Entferne die Umfrage aus der Liste der neuen Umfragen
  }

}
