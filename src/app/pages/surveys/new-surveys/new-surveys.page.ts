import { Component, OnInit } from '@angular/core';
import { Survey } from 'src/app/services/data.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { UpdateService } from 'src/app/services/update.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-new-surveys',
  templateUrl: './new-surveys.page.html',
  styleUrls: ['./new-surveys.page.scss'],
})

export class NewSurveysPage implements OnInit {

  surveys: Survey[] = [];
  showButton: boolean = false;

  constructor(
    private surveysService: SurveysService, 
    private router: Router, 
    private themeService: ThemeService,
    private storage: StorageService
  ) { }

  async ngOnInit() {
    this.surveys = await this.surveysService.loadpendingSurveys();
    console.log('Loaded surveys from storage:', this.surveys);
    this.themeService.applyTheme();
  }

  async ionViewWillEnter(){
    this.surveys = await this.surveysService.loadpendingSurveys();
    console.log('Loaded surveys from storage:', this.surveys);
    const demographic =await this.storage.get("demographic");
    this.showButton = demographic === "false";
  }


  viewSurveyDetail(surveyId: number) {
    this.router.navigate([`/survey/${surveyId}`]);
  }

}
