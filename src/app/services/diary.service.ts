import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DiaryEntry } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class DiaryService {
  private diaryEntries: DiaryEntry[] = [];

  constructor(private storage: Storage) {
    this.init(); // Initialisiere den Storage
  }

  private async init() {
    await this.storage.create();
    await this.loadDiaryEntries(); // Lade die bestehenden DiaryEntries
  }

  async loadDiaryEntries() {
    const entries = await this.storage.get('diaryEntries');
    this.diaryEntries = entries ? entries : []; // Setze die Einträge
  }

  getDiaryEntries(): DiaryEntry[] {
    return this.diaryEntries;
  }

  async saveDiaryEntry(entry: DiaryEntry) {
    this.diaryEntries.push(entry);
    await this.storage.set('diaryEntries', this.diaryEntries);
  }
}
