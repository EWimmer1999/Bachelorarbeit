import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { SurveysService } from './surveys.service';
import { Survey } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private apiUrl = 'http://192.168.0.77:3000/surveys'; // URL deines Servers

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private surveysService: SurveysService // Füge den SurveysService hier hinzu
  ) {}

  // Methode zum Abrufen der Umfragen
  async getSurveys(): Promise<void> {
    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${await this.storageService.get('token')}`
      });
  
      const response: Survey[] = await lastValueFrom(
        this.http.get<Survey[]>(this.apiUrl, { headers })
      );
  
      if (response && response.length > 0) {
        await this.surveysService.clearSurveys();
        await this.surveysService.saveSurveys(response);
        console.log('Surveys successfully fetched and stored locally');
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  }
  
}
