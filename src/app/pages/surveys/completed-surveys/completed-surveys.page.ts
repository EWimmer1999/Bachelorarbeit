import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyAnswer } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
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
  showButton: boolean = false;

  constructor(
    private router: Router,
    private surveysService: SurveysService,
    private updateService: UpdateService,
    private themeService: ThemeService,
    private storage: StorageService
  ) {}

  async ngOnInit() {

    this.completedSurveys = await this.surveysService.loadCompletedSurveys();

    this.cachedCompletedSurveys = await this.surveysService.loadCachedCompletedSurveys();

    this.completedSurveys = [...this.completedSurveys, ...this.cachedCompletedSurveys];
    
    this.themeService.applyTheme();
  }

  async ionViewWillEnter(){
    this.updateService.updateApp();
    const demographic =await this.storage.get("demographic");
    this.showButton = demographic === "false";
  }

  viewSurveyDetail(surveyId: number) {
    this.router.navigate([`/completesurvey/${surveyId}`]);
  }
}