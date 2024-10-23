import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DiaryEntry } from './data.service';
import { UpdateService } from './update.service';

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
    return this.diaryEntries.find(entry => entry.entryId === id);
  }

  async saveDiaryEntry(entry: DiaryEntry) {
    this.diaryEntries.push(entry);
    await this.storage.set('diaryEntries', this.diaryEntries);
  }

  async updateDiaryEntry(updatedEntry: DiaryEntry): Promise<void> {
  
    const index = this.diaryEntries.findIndex(entry => entry.entryId === updatedEntry.entryId);
    if (index !== -1) {
      this.diaryEntries[index] = updatedEntry; 
      await this.storage.set('diaryEntries', this.diaryEntries);
    }
  
    let scheduledEntries = await this.storage.get('scheduledEntries') || [];
    
    const scheduledIndex = scheduledEntries.findIndex((entry: DiaryEntry) => entry.entryId === updatedEntry.entryId);
    if (scheduledIndex !== -1) {
      scheduledEntries[scheduledIndex] = updatedEntry;
    } else {
      scheduledEntries.push(updatedEntry);
    }
    
    await this.storage.set('scheduledEntries', scheduledEntries);
    console.log('Eintrag der scheduledEntries-Liste hinzugefügt:', updatedEntry.entryId);
  }
  

  async prepareUpload(entry: DiaryEntry) {
    this.diaryEntries = await this.storage.get('scheduledEntries') || [];

    this.diaryEntries.push(entry);

    await this.storage.set('scheduledEntries', this.diaryEntries);
    console.log('Eintrag vorbereitet für Upload:', entry);
  }
  

  async deleteDiaryEntry(entryId: number) {
    let diaryEntries = await this.storage.get('diaryEntries') || [];

    const entryToDelete = diaryEntries.find((entry: DiaryEntry) => entry.entryId === entryId);
    if (!entryToDelete) {
        console.error('Eintrag zum Löschen nicht gefunden:', entryId);
        return;
    }

    diaryEntries = diaryEntries.filter((entry: DiaryEntry) => entry.entryId !== entryId);
    await this.storage.set('diaryEntries', diaryEntries);

    entryToDelete.deleted = true;

    let scheduledEntries = await this.storage.get('scheduledEntries') || [];
    scheduledEntries.push(entryToDelete);
    const updateScheduled = await this.storage.set('scheduledEntries', scheduledEntries);

    if (updateScheduled) {
        console.log('Eintrag wurde als gelöscht markiert und zur scheduledEntries-Liste hinzugefügt:', entryId);
    } else {
        console.error('Fehler beim Hinzufügen des Eintrags zu scheduledEntries:', entryId);
    }
  }


  saveEntries(entries: DiaryEntry[]) {
    // Iteriere über die übergebenen Einträge
    entries.forEach((newEntry) => {
      const existingIndex = this.diaryEntries.findIndex(entry => entry.entryId === newEntry.entryId);
  
      if (existingIndex !== -1) {
        // Wenn der Eintrag bereits existiert, überschreibe ihn
        this.diaryEntries[existingIndex] = newEntry;
      } else {
        // Andernfalls füge den neuen Eintrag hinzu
        this.diaryEntries.push(newEntry);
      }
    });
  
    // Optional: Speichere die aktualisierten Einträge in der lokalen Speicherung
    this.storage.set('diaryEntries', this.diaryEntries);
    console.log('Tagebucheinträge wurden gespeichert:', this.diaryEntries);
  }
  
}
