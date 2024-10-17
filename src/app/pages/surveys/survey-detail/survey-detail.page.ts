import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveysService } from 'src/app/services/surveys.service';
import { Survey } from 'src/app/services/data.service';
import { UpdateService } from 'src/app/services/update.service';
import { StorageService } from 'src/app/services/storage.service';
import { NoiseMeter } from 'capacitor-noisemeter';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.page.html',
  styleUrls: ['./survey-detail.page.scss'],
})
export class SurveyDetailPage implements OnInit {
  survey: any;  // Annahme: Deine Umfrage-Daten werden hier geladen
  token: string | undefined; // Deklariere userId

  steps: number = 0;
  interval: any;
  noiseData: number[] = [];
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
    this.survey = (await this.surveysService.loadSurveys()).find(s => s.id === surveyId) || null;
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
        this.noiseData.push(this.currentDecibels);
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
      this.calculateAverageNoise();
      this.saveAverageNoiseWithDate();
    } catch (error) {
      alert('Fehler beim Stoppen des NoiseMeters: ' + JSON.stringify(error));
    }
  }

  private calculateAverageNoise() {
    if (this.noiseData.length === 0) {
      this.averageNoise = 0; // Falls keine Daten vorhanden sind
      return;
    }
  
    const sum = this.noiseData.reduce((acc, val) => acc + val, 0);
    this.averageNoise = sum / this.noiseData.length;
  }
  

  private async saveAverageNoiseWithDate() {
    const date = new Date().toISOString();
    this.savedData = {
      date: date,
      averageNoise: this.averageNoise
    };
  
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
    this.stopNoiseMeter();
  
    // Bereite die Antworten vor
    const responses = this.survey.questions.map((question: any) => {
      return {
        questionId: question.id,
        // Konvertiere die Antwort in einen JSON-String
        answer: JSON.stringify(question.answer || question.options.filter((opt: any) => opt.selected))
      };
    });
  
    // Sende die Antworten zusammen mit dem gespeicherten Noise-Daten
    this.updateService.sendAnswer(this.survey.id, responses, this.savedData)
      .then(() => {
        console.log('Survey submitted successfully');
        
        // Navigation zur Übersicht
        this.router.navigate(['overview-surveys']);
      })
      .catch((error) => {
        console.error('Error submitting survey:', error);
      });
  }
  
}