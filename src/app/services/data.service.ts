import { Injectable } from '@angular/core';

export interface Survey {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  read: boolean
}

export interface Question {
  text: string;
  type: 'text' | 'multiple-choice';
  options?: string[];
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
          {
            text: 'What is your name?',
            type: 'text'
          },
          {
            text: 'Select your favorite colors:',
            type: 'multiple-choice',
            options: ['Red', 'Green', 'Blue']
          }
        ],
        read: true
      }
    ];
  }
}
