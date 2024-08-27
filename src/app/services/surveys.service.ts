import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Survey } from './data.service';  // Importiere das Survey Interface oder Typ

@Injectable({
  providedIn: 'root'
})
export class SurveysService {

  private surveysKey = 'surveys';  // Key unter dem die Umfragen gespeichert werden

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async saveSurveys(surveys: Survey[]): Promise<void> {
    const existingSurveys = await this.loadSurveys() || [];
    const allSurveys = [...existingSurveys, ...surveys];
    await this.storage.set(this.surveysKey, allSurveys);
  }

  async loadSurveys(): Promise<Survey[]> {
    return await this.storage.get(this.surveysKey) || [];
  }

  async clearStorage() {
    await this.storage.remove(this.surveysKey);
  }

}
