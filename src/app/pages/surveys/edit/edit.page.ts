import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Survey, SurveyAnswer } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  completedSurveys: SurveyAnswer | null = null;
  surveyId: number | undefined;

  averageNoise: any;
  survey: any;

  constructor(
    private route: ActivatedRoute,
    private surveysService: SurveysService,
    private updateService: UpdateService,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private storageService: StorageService
  ) {}
  
  ngOnInit() {
    this.loadSurveyDetails()
  }

  ngViewWillEnter(){
    this.loadSurveyDetails()
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
    try {
      const responses = this.survey.questions.map((question: any) => {
        return {
          questionId: question.id,
          answer: JSON.stringify(question.answer || question.options.filter((opt: any) => opt.selected))
        };
      });
  
      await this.saveSurveyLocally(this.survey, responses);
      await this.saveSurveyAsSurveyAnswer(this.survey, responses, this.survey.questions);
      await this.deleteSurvey(this.survey.id);
      await this.storageService.set("demographic", "true");
  
      await this.navCtrl.navigateBack('/profile'); 

      console.log('Navigation zurück erfolgreich');
    } catch (error) {
      console.error('Fehler beim Abschließen der Umfrage:', error);
    }
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
    let completedSurveys = await this.storageService.get('completedSurveys') || [];

    const existingSurveyIndex = completedSurveys.findIndex((s: SurveyAnswer) => s.surveyId === survey.id);

    console.log(existingSurveyIndex)

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

    if (existingSurveyIndex > -1) {
        completedSurveys[existingSurveyIndex] = surveyAnswer;
        console.log(`Umfrage mit ID ${survey.id} wurde überschrieben.`);
    } else {
        completedSurveys.push(surveyAnswer);
        console.log(`Neue Umfrage mit ID ${survey.id} wurde hinzugefügt.`);
    }

    await this.storageService.set('completedSurveys', completedSurveys);
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

  returnOverview() {
    this.navCtrl.pop();
  }

}
