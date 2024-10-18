import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { SurveysService } from './surveys.service';
import { TippsService } from './tipps.service';
import { Survey, SurveyAnswer, Tipp } from './data.service';
import { serverUrl } from 'src/environments/environment';
import { AuthService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private url = serverUrl;

  private surveysUrl = `${this.url}/surveys`; 

  private tippUrl = `${this.url}/tipps`;

  private answerUrl = `${this.url}/user-surveys`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private surveysService: SurveysService,
    private tippsService: TippsService,
    private authService: AuthService
  ) {}

  async getSurveys(): Promise<void> {
    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${await this.storageService.get('token')}`
      });
  
      const response: Survey[] = await lastValueFrom(
        this.http.get<Survey[]>(this.surveysUrl, { headers })
      );

      console.log(response)
  
      if (response) {
        const completedSurveys = response.filter(survey => survey.completed);

        const pendingSurveys = response.filter(survey => !survey.completed);
  
        await this.surveysService.clearSurveys();
  
        await this.surveysService.saveSurveys(completedSurveys, 'completed');
        
        await this.surveysService.saveSurveys(pendingSurveys, 'pending');
  
        console.log('Surveys successfully fetched and stored locally');
  
        this.authService.updateToken();
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  }
  
  async sendAnswer(surveyId: string, responses: any, noiseLevel: any) {
    try {

      var completed = true;

      const token = await this.storageService.get('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      const surveyAnswers = { 
        surveyId, 
        responses, 
        noiseLevel,
        completed
      };
  
      const response = await lastValueFrom(this.http.post(`${this.url}/submit-survey`, surveyAnswers, { headers }));
  
      console.log('Survey answers submitted successfully:', response);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.error('Failed to upload answers!', error.error);
      }
    }
  }


  async getTipps(): Promise<void> {

    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${await this.storageService.get('token')}`
      });
  
      const response: Tipp[] = await lastValueFrom(
        this.http.get<Tipp[]>(this.tippUrl, { headers })
      );
      console.log('Serverantwort:', response); 
      
      if (response) {
        await this.tippsService.clearTipps();
        await this.tippsService.saveTipps(response);
        console.log('Tipps successfully fetched and stored locally');

        this.authService.updateToken();
      }
    } catch (error) {
      console.error('Error fetching tipps:', error);
    }
  }


  async getAnswers(): Promise<void> {
    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${await this.storageService.get('token')}`
      });

      console.log(headers)
  
      const response: SurveyAnswer[] = await lastValueFrom(
        this.http.get<SurveyAnswer[]>(this.answerUrl, { headers })
      );
  
      console.log('Erhaltene Antworten vom Server:', response);
  
      if (response && response.length > 0) {
        await this.surveysService.saveSurveyAnswers(response);
        console.log('Antworten erfolgreich lokal gespeichert');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Antworten:', error);
    }
  }
  
}
