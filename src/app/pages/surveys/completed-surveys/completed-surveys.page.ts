import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyAnswer } from 'src/app/services/data.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-completed-surveys',
  templateUrl: './completed-surveys.page.html',
  styleUrls: ['./completed-surveys.page.scss'],
})
export class CompletedSurveysPage implements OnInit {

  completedSurveys: SurveyAnswer[] = [];
  cachedCompletedSurveys: SurveyAnswer[] = [];

  constructor(
    private router: Router,
    private surveysService: SurveysService,
    private updateService: UpdateService,
    private themeService: ThemeService
  ) {}

  async ngOnInit() {

    this.completedSurveys = await this.surveysService.loadCompletedSurveys();

    this.cachedCompletedSurveys = await this.surveysService.loadCachedCompletedSurveys();

    this.completedSurveys = [...this.completedSurveys, ...this.cachedCompletedSurveys];
    
    this.themeService.applyTheme();
  }

  ionViewWillEnter(){
    this.updateService.updateApp()
  }

  viewSurveyDetail(surveyId: number) {
    this.router.navigate([`/completesurvey/${surveyId}`]);
  }
}