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
        const pendingSurveys = response.filter(survey => !survey.completed);
  
        await this.surveysService.clearSurveys();
        
        await this.surveysService.saveSurveys(pendingSurveys, 'pending');
  
        console.log('Surveys successfully fetched and stored locally');
  
        this.authService.updateToken();
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  }
  
  async sendAnswer(surveyId: string, responses: any, noiseLevel: any): Promise<boolean> {
    try {
      const token = await this.storageService.get('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      const surveyAnswers = { 
        surveyId, 
        responses, 
        noiseLevel,
        completed: true
      };
  
      const response = await lastValueFrom(this.http.post(`${this.url}/submit-survey`, surveyAnswers, { headers }));
      
      console.log('Survey answers submitted successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to upload answers!', error);
      return false; 
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
  

  async sendCachedAnswers(): Promise<void> {
    const cachedAnswers = await this.storageService.get('pendingAnswers') || [];
    
    if (cachedAnswers.length === 0) {
      console.log('Keine zwischengespeicherten Antworten gefunden.');
      return; 
    }
  
    for (const cachedAnswer of cachedAnswers) {
      const { surveyId, responses, noiseLevel } = cachedAnswer;
      
  
      const success = await this.sendAnswer(surveyId, responses, noiseLevel);
  
      if (success) {
        console.log('Antworten wurden erfolgreich gesendet.');
        await this.deleteCachedAnswer(surveyId);
      } else {
        console.error('Antworten konnten nicht gesendet werden.');
      }
    }
  }
      
  private async deleteCachedAnswer(surveyId: string): Promise<void> {
    let pendingSurveys = await this.storageService.get('pendingAnswers') || [];

    pendingSurveys = pendingSurveys.filter((s: any) => s?.survey?.id !== surveyId);

    await this.storageService.set('pendingAnswers', pendingSurveys);
    console.log('Zwischengespeicherte Antwort gelöscht für Umfrage:', surveyId);
}


  async updateApp(): Promise<void> {

    const cachedAnswers = await this.storageService.get('pendingAnswers') || [];

    if (cachedAnswers.length > 0) {
      await this.sendCachedAnswers();
      await this.getSurveys();
      await this.getAnswers();
    } else {
      await this.getSurveys();
      await this.getAnswers();
    }   
    await this.getTipps();           
    console.log("Updated")
  }

}
