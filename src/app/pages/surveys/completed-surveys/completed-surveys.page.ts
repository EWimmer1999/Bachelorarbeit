import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyAnswer } from 'src/app/services/data.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-completed-surveys',
  templateUrl: './completed-surveys.page.html',
  styleUrls: ['./completed-surveys.page.scss'],
})
export class CompletedSurveysPage implements OnInit {

  completedSurveys: SurveyAnswer[] = [];

  constructor(
    private router: Router,
    private surveysService: SurveysService,
    private updateService: UpdateService
  ) {}

  async ngOnInit() {
    try {
      await this.updateService.getAnswers();
      this.completedSurveys = await this.surveysService.loadCompletedSurveys();
      console.log('Abgeschlossene Umfragen vom Server geladen:', this.completedSurveys);
    } catch (error) {
      console.error('Fehler beim Abrufen der abgeschlossenen Umfragen vom Server:', error);
      this.completedSurveys = await this.surveysService.loadCompletedSurveys();
      console.log('Abgeschlossene Umfragen aus dem lokalen Speicher geladen:', this.completedSurveys);
    }
  }

  async ionViewWillEnter() {
    try {
      await this.updateService.getAnswers();
      this.completedSurveys = await this.surveysService.loadCompletedSurveys();
      console.log('Abgeschlossene Umfragen erneut geladen:', this.completedSurveys);
    } catch (error) {
      console.error('Fehler beim erneuten Abrufen der Umfragen:', error);
    }
  }

  viewSurveyDetail(surveyId: number) {
    this.router.navigate([`/completesurvey/${surveyId}`]);
  }
}