import { Component, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { Survey } from 'src/app/services/data.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'overview-surveys',
  templateUrl: './overview-surveys.page.html',
  styleUrls: ['./overview-surveys.page.scss'],
})
export class OverviewSurveysPage implements OnInit {

  surveys: Survey[] = [];

  constructor(
    private surveysService: SurveysService,
    private themeService: ThemeService
  ) {}

  async ngOnInit() {
    this.surveys = await this.surveysService.loadpendingSurveys();
    console.log('Loaded surveys from storage:', this.surveys);
    this.themeService.applyTheme();
    
  }

  async ionViewWillEnter(){
    this.surveys = await this.surveysService.loadpendingSurveys();
    console.log('Loaded surveys from storage:', this.surveys);
  }

  
}
