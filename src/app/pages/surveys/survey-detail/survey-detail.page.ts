import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveysService } from 'src/app/services/surveys.service';
import { Survey } from 'src/app/services/data.service';
import { UpdateService } from 'src/app/services/update.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.page.html',
  styleUrls: ['./survey-detail.page.scss'],
})
export class SurveyDetailPage implements OnInit {
  survey: any;  // Annahme: Deine Umfrage-Daten werden hier geladen
  token: string | undefined; // Deklariere userId
  

  constructor(
    private route: ActivatedRoute,
    private surveysService: SurveysService,
    private updateService: UpdateService,
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    const surveyId = +this.route.snapshot.paramMap.get('id')!;
    this.survey = (await this.surveysService.loadSurveys()).find(s => s.id === surveyId) || null;
    this.token= await this.storageService.get('token');
  }

  returnOverview(){
    this.router.navigate(['overview-surveys']);
  }
  isChecked(option: string): boolean {
    if (!this.survey) return false;
    return (this.survey.questions.find((q: { type: string; }) => q.type === 'multiple-choice')?.answer || []).includes(option);
  }

  onMultipleChoiceChange(option: string, event: any) {
    if (!this.survey) return;
    const question = this.survey.questions.find((q: { type: string; }) => q.type === 'multiple-choice');
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


  submitSurvey() {
    const responses = this.survey.questions.map((question: any) => {
      return {
        questionId: question.id,
        // Konvertiere die Antwort in einen JSON-String
        answer: JSON.stringify(question.answer || question.options.filter((opt: any) => opt.selected))
      };
    });
  
    // Sende die Antworten (Token wird in UpdateService hinzugefügt)
    this.updateService.sendAnswer(this.survey.id, responses)
      .then(() => {
        console.log('Survey submitted successfully');
        
        this.router.navigate(['overview-surveys']);

      })
      .catch((error) => {
        console.error('Error submitting survey:', error);
      });
  }
  
}