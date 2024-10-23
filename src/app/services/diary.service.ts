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
  
    // Füge den aktualisierten Eintrag der scheduledEntries-Liste hinzu
    let scheduledEntries = await this.storage.get('scheduledEntries') || [];
    
    // Überprüfe, ob der Eintrag bereits in scheduledEntries vorhanden ist
    const scheduledIndex = scheduledEntries.findIndex((entry: DiaryEntry) => entry.entryId === updatedEntry.entryId);
    if (scheduledIndex !== -1) {
      // Aktualisiere den vorhandenen Eintrag
      scheduledEntries[scheduledIndex] = updatedEntry;
    } else {
      // Füge den neuen Eintrag hinzu
      scheduledEntries.push(updatedEntry);
    }
    
    // Speichere die aktualisierte scheduledEntries-Liste
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
    // Lade die Liste der Tagebucheinträge
    let diaryEntries = await this.storage.get('diaryEntries') || [];

    // Finde den zu löschenden Eintrag
    const entryToDelete = diaryEntries.find((entry: DiaryEntry) => entry.entryId === entryId);
    if (!entryToDelete) {
        console.error('Eintrag zum Löschen nicht gefunden:', entryId);
        return;
    }

    // Entferne den Eintrag aus der diaryEntries-Liste
    diaryEntries = diaryEntries.filter((entry: DiaryEntry) => entry.entryId !== entryId);
    await this.storage.set('diaryEntries', diaryEntries);

    // Setze das deleted-Flag auf true
    entryToDelete.deleted = true;

    // Füge den Eintrag zur Liste der scheduledEntries hinzu
    let scheduledEntries = await this.storage.get('scheduledEntries') || [];
    scheduledEntries.push(entryToDelete);
    const updateScheduled = await this.storage.set('scheduledEntries', scheduledEntries);

    if (updateScheduled) {
        console.log('Eintrag wurde als gelöscht markiert und zur scheduledEntries-Liste hinzugefügt:', entryId);
    } else {
        console.error('Fehler beim Hinzufügen des Eintrags zu scheduledEntries:', entryId);
    }
  }

}
