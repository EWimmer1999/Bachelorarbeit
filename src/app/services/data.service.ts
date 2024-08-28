import { Injectable } from '@angular/core';

export interface Survey {
  id: number;
  title: string;
  description?: string;
  questions: Question[];
  isCompleted?: boolean; 
}

export interface Question {
  id: number;
  text: string;
  type: 'text' | 'multiple-choice' | 'single-choice';
  options?: string[]; // Nur relevant für multiple-choice und single-choice
  answer?: string | string[]; // Benutzerantworten, Typ hängt vom Fragetyp ab
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Dein Service-Code hier

  getSurveys(): Survey[] {
    // Beispiel-Daten, die im Service bereitgestellt werden könnten
    return [
      {
        id: 1,
        title: 'Survey 1',
        description: 'Description for Survey 1',
        questions: [
         
        ],
        isCompleted: true
      }
    ];
  }
}
