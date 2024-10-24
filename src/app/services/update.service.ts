import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { SurveysService } from './surveys.service';
import { TippsService } from './tipps.service';
import { DiaryEntry, Survey, SurveyAnswer, Tipp, Settings } from './data.service';
import { serverUrl } from 'src/environments/environment';
import { AuthService } from './authentication.service';
import { DiaryService } from './diary.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private url = serverUrl;

  private surveysUrl = `${this.url}/surveys`; 

  private tippUrl = `${this.url}/tipps`;

  private answerUrl = `${this.url}/user-surveys`;

  private diaryUrl = `${this.url}/diary-entries`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private surveysService: SurveysService,
    private tippsService: TippsService,
    private authService: AuthService,
    private diaryService: DiaryService
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

  async sendDiary(entry: DiaryEntry) {
 
    try {
      const token = await this.storageService.get('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      const response = await lastValueFrom(this.http.post(`${this.url}/diary-entry`, entry, { headers }));
      
      console.log('Diary answer submitted successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to upload answers!', error);
      return false; 
    }
  }

  async sendCachedDiary(): Promise<void> {
    const cachedDiaries = await this.storageService.get('scheduledEntries') || [];
    
    if (cachedDiaries.length === 0) {
      console.log('Keine zwischengespeicherten Einträge gefunden.');
      return; 
    }
  
    for (const cachedDiary of cachedDiaries) {
     
      const success = await this.sendDiary(cachedDiary);
  
      if (success) {
        console.log('Antworten wurden erfolgreich gesendet.');
        await this.deleteCachedDiary(cachedDiary.entryId);
      } else {
        console.error('Antworten konnten nicht gesendet werden.');
      }
    }
  }
      
  private async deleteCachedDiary(entryId: number): Promise<void> {
    let pendingDiaries = await this.storageService.get('scheduledEntries') || [];

    pendingDiaries = pendingDiaries.filter((entry: DiaryEntry) => entry.entryId !== entryId);

    const test = await this.storageService.set('scheduledEntries', pendingDiaries);

    if (test) {
        console.log('Zwischengespeicherter Eintrag gelöscht:', entryId);
    } else {
        console.error('Fehler beim Löschen des zwischengespeicherten Eintrags:', entryId);
    }
  }

  async updateApp(): Promise<void> {

    const cachedAnswers = await this.storageService.get('pendingAnswers') || [];
    const cachedEntries = await this.storageService.get('scheduledEntries') || [];
    const settings = await this.storageService.get('settings') || {};

    if (cachedAnswers.length > 0) {
      await this.sendCachedAnswers();
    }    

    if (cachedEntries.length > 0) {
      await this.sendCachedDiary();
    }

    if (Object.keys(settings).length > 0) {
      await this.saveSettings();
    }

    await this.getSurveys();
    await this.getAnswers();
    await this.getTipps();           
    console.log("Updated");
  }



  async getDiaries(): Promise<void> {

    const scheduledEntries = await this.storageService.get('scheduledEntries') || []

    if (scheduledEntries.length > 0) {
      console.log('Es gibt geplante Einträge. Die Serverabfrage wird abgebrochen.');
      this.sendCachedDiary();
    }
  
    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${await this.storageService.get('token')}`
      });

      console.log(headers)
  
      const response: DiaryEntry[] = await lastValueFrom(
        this.http.get<DiaryEntry[]>(this.diaryUrl, { headers })
      );
  
      console.log('Erhaltene Antworten vom Server:', response);
  
      if (response && response.length > 0) {
        await this.diaryService.saveEntries(response);
        console.log('Antworten erfolgreich lokal gespeichert');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Antworten:', error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; errorCode?: number }> {
    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${await this.storageService.get('token')}`
      });
  
      const passwords = { 
        currentPassword,
        newPassword
      };
  
      const response = await lastValueFrom(this.http.post(`${this.url}/change-password`, passwords, { headers }));
      
      console.log('Changed password successfully:', response);
      return { success: true };
    } catch (error) {
      console.error('Failed to change password!', error);
      
      const errorCode = (error instanceof HttpErrorResponse) ? error.status : 500;
      
      return { success: false, errorCode };
    }
  }


  async saveSettings(): Promise<void> {
    console.log("Trying to update settings")
    try {
      const settings = await this.storageService.get('settings') || [];
      const token = await this.storageService.get('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      const response = await lastValueFrom(
        this.http.post(`${this.url}/save-settings`, { settings }, { headers })
      );

      console.log('Einstellungen erfolgreich gespeichert:', response);
      await this.storageService.remove('settings')

    } catch (error) {
      console.error('Fehler beim Speichern der Einstellungen:', error);
    }
  }

  async getSettings(): Promise<Settings | null> {
    try {
      const token = await this.storageService.get('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
  
      const response = await lastValueFrom(
        this.http.get<Settings>(`${this.url}/get-settings`, { headers })
      );
  
      console.log('Erhaltene Einstellungen vom Server:', response);
      
      if (response) {
        await this.storageService.set('darkModeActivated', response.darkMode.toString());
        await this.storageService.set('noiseDataActivated', response.noiseData.toString());
        await this.storageService.set('stepDataActivated', response.stepData.toString());
      }
      
      return response;
    } catch (error) {
      console.error('Fehler beim Abrufen der Einstellungen:', error);
      return null;
    }
  }
}
