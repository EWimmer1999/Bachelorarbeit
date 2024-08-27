import { Component, OnInit } from '@angular/core';
import { Survey } from 'src/app/services/data.service';
import { SurveysService } from 'src/app/services/surveys.service';

@Component({
  selector: 'app-completed-surveys',
  templateUrl: './completed-surveys.page.html',
  styleUrls: ['./completed-surveys.page.scss'],
})
export class CompletedSurveysPage implements OnInit {

  completedSurveys: Survey[] = []; 

  constructor(private surveysService: SurveysService) { }

  async ngOnInit() {
    this.completedSurveys = await this.surveysService.loadCompletedSurveys();
  }

}
