import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyAnswer } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UpdateService } from 'src/app/services/update.service';

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
    private surveysService: SurveysService,
    private updateService: UpdateService,
    private themeService: ThemeService,
  ) {}

  async ngOnInit() {
    const surveyIdParam = this.route.snapshot.paramMap.get('id');
    this.surveyId = surveyIdParam ? Number(surveyIdParam) : undefined;
    console.log('Gesuchte Umfrage-ID:', this.surveyId);
    await this.loadSurveyDetails();
    this.themeService.applyTheme();
  }

  async ionViewWillEnter(){
    this.updateService.updateApp()
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
