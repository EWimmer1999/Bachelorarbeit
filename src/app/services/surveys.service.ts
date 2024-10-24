import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Survey, SurveyAnswer } from './data.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment, serverUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurveysService {

  private completesurveysKey = 'completesurveys';
  private pendingsurveysKey = 'pendingsurveys';

  constructor(private storage: Storage, private http: HttpClient) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async saveSurveys(surveys: Survey[], completed: string): Promise<void> {
    if (!surveys || surveys.length === 0) {
        return; 
    }

    if (completed === 'completed') {
        await this.storage.set(this.completesurveysKey, surveys);
    } else {
        await this.storage.set(this.pendingsurveysKey, surveys);
    }
  }

  async loadpendingSurveys(): Promise<Survey[]> {
    return await this.storage.get(this.pendingsurveysKey) || [];
  }

  async clearSurveys() {
    await this.storage.remove(this.pendingsurveysKey);
    await this.storage.remove(this.completesurveysKey);
  }

  async clearCompletedSurveys() {
    await this.storage.remove(this.completesurveysKey);
  }

  async saveSurveyAnswers(answers: SurveyAnswer[]): Promise<void> {
    try {
        let existingSurveys = await this.storage.get('completedSurveys') || [];

        answers.forEach((newAnswer) => {
            existingSurveys = existingSurveys.filter((existingSurvey: SurveyAnswer) => existingSurvey.surveyId !== newAnswer.surveyId);
        });

        existingSurveys.push(...answers);

        console.log('Speichern der Antworten unter dem Schlüssel "completedSurveys":', existingSurveys);
        await this.storage.set('completedSurveys', existingSurveys);

        console.log('Antworten erfolgreich im lokalen Speicher abgelegt');
    } catch (error) {
        console.error('Fehler beim Speichern der Antworten im lokalen Speicher:', error);
    }
  }

  async loadCompletedSurveys(): Promise<SurveyAnswer[]> {
    try {
        const completedSurveys = await this.storage.get('completedSurveys');
        console.log('Laden der erledigten Umfragen:', completedSurveys);

        return completedSurveys ? (completedSurveys as SurveyAnswer[]) : [];
    } catch (error) {
        console.error('Fehler beim Laden der erledigten Umfragen:', error);
        return [];
    }
  }

  async loadCachedCompletedSurveys(): Promise<SurveyAnswer[]> {
    
    const cachedSurveys = await this.storage.get('cached');
    console.log('Laden der erledigten Umfragen:', cachedSurveys);

    return cachedSurveys ? (cachedSurveys as SurveyAnswer[]) : [];
  }
  
}
