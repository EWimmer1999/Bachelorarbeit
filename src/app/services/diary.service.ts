import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DiaryEntry } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class DiaryService {
  private diaryEntries: DiaryEntry[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    await this.loadDiaryEntries();
  }

  async loadDiaryEntries() {
    const entries = await this.storage.get('diaryEntries');
    this.diaryEntries = entries ? entries : []; 
  }

  getDiaryEntries(): DiaryEntry[] {
    return this.diaryEntries;
  }

  async getDiaryEntry(id: number): Promise<DiaryEntry | undefined> {
    return this.diaryEntries.find(entry => entry.id === id);
  }

  async saveDiaryEntry(entry: DiaryEntry) {
    this.diaryEntries.push(entry);
    await this.storage.set('diaryEntries', this.diaryEntries);
  }

  async updateDiaryEntry(updatedEntry: DiaryEntry): Promise<void> {
    const index = this.diaryEntries.findIndex(entry => entry.id === updatedEntry.id);
    if (index !== -1) {
      this.diaryEntries[index] = updatedEntry; 
      await this.storage.set('diaryEntries', this.diaryEntries);
    }
  }
}
