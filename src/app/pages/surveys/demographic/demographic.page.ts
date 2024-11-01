import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Survey, SurveyAnswer } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-demographic',
  templateUrl: './demographic.page.html',
  styleUrls: ['./demographic.page.scss'],
})
export class DemographicPage implements OnInit {
  averageNoise: any;
  survey: any;

  constructor(
    private surveysService: SurveysService,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    this.loadSurveyDetails();
    this.themeService.applyTheme();
  }

  returnOverview() {
    this.navCtrl.pop();
  }

  async loadSurveyDetails() {
    try {
      const demographicSurvey = await this.storageService.get("demographic");
      
      if (demographicSurvey && demographicSurvey !== "true") {
        this.survey = demographicSurvey;
        console.log('Umfrage geladen:', this.survey.title);
      } else {
        console.log('Demografische Umfrage nicht gefunden oder bereits abgeschlossen.');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Umfrage-Details:', error);
    }
  }

  async submitSurvey() {
    const responses = this.survey.questions.map((question: any) => {
      return {
        questionId: question.id,
        answer: JSON.stringify(question.answer || question.options.filter((opt: any) => opt.selected))
      };
    });

    await this.saveSurveyLocally(this.survey, responses);
    await this.saveSurveyAsSurveyAnswer(this.survey, responses, this.survey.questions);
    await this.deleteSurvey(this.survey.id);
    await this.storageService.set("demographicTag", "true");

    this.navCtrl.pop(); 
  }

  private async deleteSurvey(surveyId: number): Promise<void> {
    let pendingSurveys = await this.storageService.get('pendingsurveys') || [];
    pendingSurveys = pendingSurveys.filter((survey: Survey) => survey.id !== surveyId);
    await this.storageService.remove('pendingsurveys');
    await this.storageService.set('pendingsurveys', pendingSurveys);
    console.log(`Umfrage mit der ID ${surveyId} wurde erfolgreich gelöscht.`);
  }

  private async saveSurveyLocally(survey: any, responses: any) {
    let pendingAnswers = await this.storageService.get('pendingAnswers') || [];
  
    pendingAnswers.push({
      surveyId: survey.id,
      responses: responses,
      noiseLevel: this.averageNoise,
      completed: true
    });
  
    await this.storageService.set('pendingAnswers', pendingAnswers);
    console.log('Umfrage wurde lokal zwischengespeichert:', pendingAnswers);
  }
  
  private async saveSurveyAsSurveyAnswer(survey: any, responses: any, questions: any): Promise<void> {
    let pendingSurveys = await this.storageService.get('completedSurveys') || [];

    const surveyAnswer: SurveyAnswer = {
        surveyId: survey.id,
        surveyTitle: survey.title,
        surveyDescription: survey.description,
        completed: true,
        noiseLevel: this.averageNoise,
        questions: questions.map((question: any) => {
            const response = responses.find((resp: any) => resp.questionId === question.id);
            return {
                questionId: question.id,
                questionText: question.text,
                questionType: question.type,
                answer: response ? response.answer : null
            };
        }),
    };

    pendingSurveys.push(surveyAnswer);
    await this.storageService.set('completedSurveys', pendingSurveys);
    console.log('Umfrage wurde als SurveyAnswer lokal zwischengespeichert:', surveyAnswer);
  }


  onMultipleChoiceChange(option: string, event: any) {
    if (!this.survey) return;
    const question = this.survey.questions.find((q: { type: string; }) => q.type === 'multiple-choice');
    if (question) {
      if (event.detail.checked) {
        if (!Array.isArray(question.answer)) {
          question.answer = [];
        }
        (question.answer as string[]).push(option);
      } else {
        if (Array.isArray(question.answer)) {
          question.answer = (question.answer as string[]).filter(o => o !== option);
        }
      }
    }
  }

  isChecked(option: string): boolean {
    if (!this.survey) return false;
    return (this.survey.questions.find((q: { type: string; }) => q.type === 'multiple-choice')?.answer || []).includes(option);
  }
}
