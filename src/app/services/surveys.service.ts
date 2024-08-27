import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Survey } from './data.service';  // Importiere das Survey Interface oder Typ

@Injectable({
  providedIn: 'root'
})
export class SurveysService {

  private surveysKey = 'surveys';  // Key unter dem die Umfragen gespeichert werden
  private completedSurveysKey = 'completedSurveys';  // Key für abgeschlossene Umfragen

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async saveSurveys(surveys: Survey[]): Promise<void> {
    const existingSurveys = await this.loadSurveys() || [];
    const newSurveys = surveys.filter(survey => !existingSurveys.some(existingSurvey => existingSurvey.id === survey.id));
  
    const allSurveys = [...existingSurveys, ...newSurveys];
    await this.storage.set(this.surveysKey, allSurveys);
  }
  
  async loadSurveys(): Promise<Survey[]> {
    return await this.storage.get(this.surveysKey) || [];
  }

  async markSurveyAsCompleted(survey: Survey): Promise<void> {
    let completedSurveys = await this.loadCompletedSurveys() || [];
    completedSurveys = [...completedSurveys, survey];
    await this.storage.set(this.completedSurveysKey, completedSurveys);

    // Optionally remove the completed survey from the 'new' surveys list
    let newSurveys = await this.loadSurveys();
    newSurveys = newSurveys.filter(s => s.id !== survey.id);
    await this.storage.set(this.surveysKey, newSurveys);
  }

  async loadCompletedSurveys(): Promise<Survey[]> {
    const allSurveys = await this.loadSurveys();
    return allSurveys.filter(survey => survey.isCompleted);
  }
  
  async clearSurveys() {
    await this.storage.remove(this.surveysKey);
  }

  async clearCompletedSurveys() {
    await this.storage.remove(this.completedSurveysKey);
  }
}
