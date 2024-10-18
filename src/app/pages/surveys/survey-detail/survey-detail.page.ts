import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveysService } from 'src/app/services/surveys.service';
import { UpdateService } from 'src/app/services/update.service';
import { StorageService } from 'src/app/services/storage.service';
import { NoiseMeter } from 'capacitor-noisemeter';

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

  constructor(
    private route: ActivatedRoute,
    private surveysService: SurveysService,
    private updateService: UpdateService,
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    const surveyId = +this.route.snapshot.paramMap.get('id')!;
    this.survey = (await this.surveysService.loadpendingSurveys()).find(s => s.id === surveyId) || null;
    this.token= await this.storageService.get('token');
  }

  async ionViewDidEnter() {
    this.startNoiseMeter()
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
    this.stopNoiseMeter()
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
    await this.stopNoiseMeter();
  
    const responses = this.survey.questions.map((question: any) => {
      return {
        questionId: question.id,
        answer: JSON.stringify(question.answer || question.options.filter((opt: any) => opt.selected))
      };
    });
  
    try {
      await this.updateService.sendAnswer(this.survey.id, responses, this.averageNoise);
      console.log('Survey submitted successfully');
  
      await this.deleteSurvey(this.survey);
    } catch (error) {
      console.error('Fehler beim Übermitteln der Umfrage:', error);
      
      await this.saveSurveyLocally(this.survey, responses);
    }

    this.router.navigate([`/overview-surveys`]);
  }
  
  private async deleteSurvey(survey: any) {

    let pendingSurveys = await this.storageService.get('pendingSurveys') || [];
  
    pendingSurveys = pendingSurveys.filter((s: any) => s.survey.id !== survey.id);
  
    await this.storageService.set('pendingSurveys', pendingSurveys);
    console.log('Umfrage wurde erfolgreich gelöscht:', survey);
  }
  
  private async saveSurveyLocally(survey: any, responses: any) {
    let pendingSurveys = await this.storageService.get('pendingSurveys') || [];
  
    pendingSurveys.push({
      survey: survey,
      responses: responses,
      averageNoise: this.averageNoise,
      timestamp: new Date().toISOString()
    });
  
    await this.storageService.set('pendingSurveys', pendingSurveys);
    console.log('Umfrage wurde lokal zwischengespeichert:', survey);
  }
}