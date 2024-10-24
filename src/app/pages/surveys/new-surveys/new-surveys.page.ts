import { Component, OnInit } from '@angular/core';
import { Survey } from 'src/app/services/data.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { UpdateService } from 'src/app/services/update.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-surveys',
  templateUrl: './new-surveys.page.html',
  styleUrls: ['./new-surveys.page.scss'],
})

export class NewSurveysPage implements OnInit {

  surveys: Survey[] = [];

  constructor(private surveysService: SurveysService, private router: Router, private updateService: UpdateService) { }

  async ngOnInit() {
    this.surveys = await this.surveysService.loadpendingSurveys();
    console.log('Loaded surveys from storage:', this.surveys);
    
  }

  async ionViewWillEnter(){
    this.surveys = await this.surveysService.loadpendingSurveys();
    console.log('Loaded surveys from storage:', this.surveys);
  }


  viewSurveyDetail(surveyId: number) {
    this.router.navigate([`/survey/${surveyId}`]);
  }

}
