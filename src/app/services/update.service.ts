import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { SurveysService } from './surveys.service';
import { Survey } from './data.service';
import { environment } from 'src/environments/environment.prod';
import { serverUrl } from 'src/environments/environment';

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

  async sendAnswer(surveyId: string, responses: any, noiseData: any) {
    try {
      // Token aus dem Storage abrufen
      const token = await this.storageService.get('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      // Daten für die Anfrage
      const surveyAnswers = { 
        surveyId, 
        responses, 
        noiseData  // Füge hier das noiseData hinzu
      };
  
      const response = await lastValueFrom(this.http.post('http://192.168.0.77:3000/submit-survey', surveyAnswers, { headers }));
  
      console.log('Survey answers submitted successfully:', response);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.error('Failed to upload answers!', error.error);
      }
    }
  }
  
  
  
}
