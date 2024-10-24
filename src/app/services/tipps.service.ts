import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Tipp } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class TippsService {

  private tippsKey = 'tipps'; 

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async saveTipps(tipps: Tipp[]): Promise<void> {
    const existingTipps = await this.loadTipps();
    const updatedTippsMap = new Map(existingTipps.map(tipp => [tipp.id, tipp]));
  
    tipps.forEach(tipp => {
      updatedTippsMap.set(tipp.id, tipp); 
    });
  
    await this.storage.set(this.tippsKey, Array.from(updatedTippsMap.values()));
  }
  
  
  async loadTipps(): Promise<Tipp[]> {
    return await this.storage.get(this.tippsKey) || [];
  }

  async clearTipps() {
    await this.storage.remove(this.tippsKey);
  }
}
