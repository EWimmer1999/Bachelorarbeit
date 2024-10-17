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
    
  }

  async ionViewWillEnter(){
    this.surveys = await this.surveysService.loadSurveys();
    console.log('Loaded surveys from storage:', this.surveys);

    try {
      await this.updateService.getSurveys();
      this.surveys = await this.surveysService.loadSurveys();
      console.log('Loaded surveys from server:', this.surveys);
    } catch (error) {
      console.error('Failed to fetch new tips, loading from storage:', error);
    }
  }

  async startSurvey(survey: Survey) {
    await this.surveysService.markSurveyAsCompleted(survey);
    this.surveys = this.surveys.filter(s => s.id !== survey.id);  // Entferne die Umfrage aus der Liste der neuen Umfragen
  }

  viewSurveyDetail(surveyId: number) {
    this.router.navigate([`/survey/${surveyId}`]);
  }

}
