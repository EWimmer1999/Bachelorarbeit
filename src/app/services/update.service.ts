import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { SurveysService } from './surveys.service';
import { TippsService } from './tipps.service';
import { Survey, Tipp } from './data.service';
import { serverUrl } from 'src/environments/environment';
import { AuthService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private url = serverUrl;

  private surveysUrl = `${this.url}/surveys`; 

  private tippUrl = `${this.url}/tipps`;

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
  
      if (response) {
        await this.surveysService.clearSurveys();
        await this.surveysService.saveSurveys(response);
        console.log('Surveys successfully fetched and stored locally');

        this.authService.updateToken();
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  }


  async sendAnswer(surveyId: string, responses: any, noiseLevel: any) {
    try {

      const token = await this.storageService.get('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      const surveyAnswers = { 
        surveyId, 
        responses, 
        noiseLevel 
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
}
