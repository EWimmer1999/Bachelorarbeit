import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveysService } from 'src/app/services/surveys.service';
import { UpdateService } from 'src/app/services/update.service';
import { StorageService } from 'src/app/services/storage.service';
import { NoiseMeter } from 'capacitor-noisemeter';
import { Survey, SurveyAnswer } from 'src/app/services/data.service';
import { NavController } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-survey-detail',
  templateUrl:  './survey-detail.page.html',
  styleUrls: ['./survey-detail.page.scss'],
})

export class SurveyDetailPage implements OnInit {
  survey: any;
  token: string | undefined;

  steps: number = 0;
  interval: any;
  noiseLevel: number[] = [];
  averageNoise: number = 0;
  currentDecibels: number = 0;
  noise: boolean = true;
  savedData: any;
  noiseMeter: string = 'false';

  constructor(
    private route: ActivatedRoute,
    private surveysService: SurveysService,
    private updateService: UpdateService,
    private storageService: StorageService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  async ngOnInit() {
    const surveyId = +this.route.snapshot.paramMap.get('id')!;
    this.survey = (await this.surveysService.loadpendingSurveys()).find(s => s.id === surveyId) || null;
    this.themeService.applyTheme();
    this.noiseMeter = this.storageService.get('noiseDataActivated').toString()
  }

  async ionViewDidEnter() {

    if(this.noiseMeter === 'true'){
      this.startNoiseMeter()
    }
  }

  async startNoiseMeter() {
    try {
      await NoiseMeter.startRecording();
      this.interval = setInterval(() => {
        this.getNoiseLevel();
      }, 1000);
    } catch (error) {
      alert('Fehler beim Starten des NoiseMeters: ' + JSON.stringify(error));
    }
  }

  async getNoiseLevel() {
    try {
      const result = await NoiseMeter.getNoiseLevel();
      this.currentDecibels = result.decibels;
      
      if (!isNaN(this.currentDecibels)) {
        this.noiseLevel.push(this.currentDecibels);
      } else {
        console.log('Ungültiger Geräuschpegel: ', this.currentDecibels);
      }
    } catch (error) {
      console.log('Fehler beim Abrufen des Geräuschpegels:', error);
    }
  }

  async stopNoiseMeter() {
    try {
      clearInterval(this.interval);
      await NoiseMeter.stop();
      await this.calculateAverageNoise();
      await this.saveAverageNoiseWithDate();
    } catch (error) {
      alert('Fehler beim Stoppen des NoiseMeters: ' + JSON.stringify(error));
    }
  }

  private calculateAverageNoise() {
    if (this.noiseLevel.length === 0) {
      this.averageNoise = 0;
      return;
    }
  
    const sum = this.noiseLevel.reduce((acc, val) => acc + val, 0);
    this.averageNoise = sum / this.noiseLevel.length;
  }
  
  private async saveAverageNoiseWithDate() {
    const date = new Date().toISOString();
    this.savedData = {
      date: date,
      averageNoise: this.averageNoise
    };
    console.log(this.averageNoise)
    console.log('Zu speichernde Daten:', this.savedData);
    await this.storageService.set(date, this.savedData);
    console.log('Gespeicherte Daten:', this.savedData);
  }

  returnOverview(){
    if(this.noiseMeter === 'true'){
      this.stopNoiseMeter()
    }
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

  async submitSurvey() {
    if(this.noiseMeter === 'true'){
      this.stopNoiseMeter()
    }
  
    const responses = this.survey.questions.map((question: any) => {
      return {
        questionId: question.id,
        answer: JSON.stringify(question.answer || question.options.filter((opt: any) => opt.selected))
      };
    });

    await this.saveSurveyLocally(this.survey, responses);
    await this.saveSurveyAsSurveyAnswer(this.survey, responses, this.survey.questions);
    await this.deleteSurvey(this.survey.id);
    
    this.router.navigate([`/overview-surveys`]);
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
}