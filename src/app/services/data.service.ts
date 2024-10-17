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

export interface Tipp {
  id: number;
  title: string,
  flavour: string,
  text: string
}
@Injectable({
  providedIn: 'root'
})
export class DataService {

  getSurveys(): Survey[] {
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

  getTipps(): Tipp[] {
    return [
      {
        id: 1,
        title: 'TestTipp',
        flavour: 'This is a flavour text',
        text: 'This is a very long test text',
      }
    ]
  }
}
