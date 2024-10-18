import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyAnswer } from 'src/app/services/data.service';
import { SurveysService } from 'src/app/services/surveys.service';

@Component({
  selector: 'app-completed-survey-detail',
  templateUrl: './completed-survey-detail.page.html',
  styleUrls: ['./completed-survey-detail.page.scss'],
})
export class CompletedSurveyDetailPage implements OnInit {
  completedSurveys: SurveyAnswer | null = null;
  surveyId: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private surveysService: SurveysService
  ) {}

  async ngOnInit() {
    const surveyIdParam = this.route.snapshot.paramMap.get('id'); // Hier 'id' anstelle von 'surveyId'
    this.surveyId = surveyIdParam ? Number(surveyIdParam) : undefined; // Umwandlung in number
    console.log('Gesuchte Umfrage-ID:', this.surveyId);
    await this.loadSurveyDetails();
  }

  async loadSurveyDetails() {
    try {
      const completedSurveys = await this.surveysService.loadCompletedSurveys();
      this.completedSurveys = completedSurveys.find(survey => survey.surveyId === this.surveyId) || null;
      console.log('Umfrage Details:', this.completedSurveys);
    } catch (error) {
      console.error('Fehler beim Laden der Umfrage-Details:', error);
    }
  }
}
