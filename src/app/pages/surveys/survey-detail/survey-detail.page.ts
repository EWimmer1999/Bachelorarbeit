import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveysService } from 'src/app/services/surveys.service';
import { Survey } from 'src/app/services/data.service';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.page.html',
  styleUrls: ['./survey-detail.page.scss'],
})
export class SurveyDetailPage implements OnInit {
  survey: Survey | null = null;

  constructor(
    private route: ActivatedRoute,
    private surveysService: SurveysService
  ) {}

  async ngOnInit() {
    const surveyId = +this.route.snapshot.paramMap.get('id')!;
    this.survey = (await this.surveysService.loadSurveys()).find(s => s.id === surveyId) || null;
  }

  isChecked(option: string): boolean {
    if (!this.survey) return false;
    return (this.survey.questions.find(q => q.type === 'multiple-choice')?.answer || []).includes(option);
  }

  onMultipleChoiceChange(option: string, event: any) {
    if (!this.survey) return;
    const question = this.survey.questions.find(q => q.type === 'multiple-choice');
    if (question) {
      if (event.detail.checked) {
        // Initialize answer as array if it's not already
        if (!Array.isArray(question.answer)) {
          question.answer = [];
        }
        (question.answer as string[]).push(option);
      } else {
        // Ensure answer is an array before filtering
        if (Array.isArray(question.answer)) {
          question.answer = (question.answer as string[]).filter(o => o !== option);
        }
      }
    }
  }
}