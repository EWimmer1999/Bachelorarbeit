import { Component, OnInit } from '@angular/core';
import { SurveyAnswer } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  showButton: boolean = false;
  completedSurveys: SurveyAnswer | null = null;
  surveyId: number = 1;

  constructor(
    private themeService: ThemeService,
    private updateService: UpdateService,
    private storage: StorageService,
    private surveysService: SurveysService
  ) { }

  async ngOnInit() {
    this.themeService.applyTheme();
    console.log('Gesuchte Umfrage-ID:', this.surveyId);
    await this.loadSurveyDetails();
  }

  async ionViewWillEnter(){
    this.themeService.applyTheme();
    this.updateService.updateApp();
    const demographic = await this.storage.get("demographicTag");
    this.showButton = demographic === "false";
    console.log('Gesuchte Umfrage-ID:', this.surveyId);
    await this.loadSurveyDetails();
  }

  ionViewDidEnter(){
    this.updateService.updateApp();
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
