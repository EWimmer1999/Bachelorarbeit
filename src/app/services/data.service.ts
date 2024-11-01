import { Injectable } from '@angular/core';

export interface Survey {
  id: number;
  title: string;
  description?: string;
  questions: Question[];
  completed?: string; 
  demographic: boolean;
}

export interface Question {
  id: number;
  text: string;
  type: 'text' | 'multiple-choice' | 'single-choice';
  options?: string[];
  answer?: string | string[];
}

export interface SurveyAnswer {
  surveyId: number;
  surveyTitle: string;
  surveyDescription: string;
  completed: boolean;
  noiseLevel: number;
  questions: {
    questionId: number;
    questionText: string;
    questionType: string;
    answer: string | null;
  }[];
}

export interface Tipp {
  id: number;
  title: string,
  flavour: string,
  text: string
}


export interface DiaryEntry {
  entryId: number;
  date: string; 
  time: string; 
  foodCategory: string;
  information: string;
  notes: string;
  activities: {
    happy: boolean;
    excited: boolean;
    sad: boolean;
  };
  stressLevel: number;
  deleted: boolean;
}

export interface Settings {
  darkMode: string;
  noiseData: string;
  stepData: string;
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
        completed: 'true',
        demographic: true
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
