import { Component, OnInit, OnDestroy } from '@angular/core';
import { StepCounter } from 'capacitor-stepcounter';
import { NoiseMeter } from 'capacitor-noisemeter';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  steps: number = 0;
  interval: any;
  noiseData: number[] = [];
  averageNoise: number = 0;
  currentDecibels: number = 0;

  constructor(private storage: StorageService) {} // Storage injizieren

  async ngOnInit() {
    await this.storage.initStorage(); // Storage initialisieren
    await this.startStepCounter();
    this.updateStepCount();

    this.interval = setInterval(() => {
      this.updateStepCount();
    }, 5000);
  }

  private async startStepCounter() {
    try {
      await StepCounter.start();
    } catch (error) {
      alert('Fehler beim Starten des Schrittzählers: ' + JSON.stringify(error));
    }
  }

  public async updateStepCount() {
    try {
      const result = await StepCounter.getStepCount();
      this.steps = result.steps;
    } catch (error) {
      alert('Fehler beim Abrufen der Schrittanzahl: ' + JSON.stringify(error));
    }
  }

  async startNoiseMeter() {
    try {
      await NoiseMeter.startRecording();
      this.interval = setInterval(() => {
        this.getNoiseLevel();
      }, 1000);
    } catch (error) {
      alert('Fehler beim Starten des NoiseMeters: ' + JSON.stringify(error));
    }
  }

  async getNoiseLevel() {
    try {
      const result = await NoiseMeter.getNoiseLevel();
      this.currentDecibels = result.decibels;
      
      if (!isNaN(this.currentDecibels)) {
        this.noiseData.push(this.currentDecibels);
      } else {
        console.log('Ungültiger Geräuschpegel: ', this.currentDecibels);
      }
    } catch (error) {
      console.log('Fehler beim Abrufen des Geräuschpegels:', error);
    }
  }
  

  async stopNoiseMeter() {
    try {
      clearInterval(this.interval);
      await NoiseMeter.stop();
      this.calculateAverageNoise();
      this.saveAverageNoiseWithDate();
    } catch (error) {
      alert('Fehler beim Stoppen des NoiseMeters: ' + JSON.stringify(error));
    }
  }

  private calculateAverageNoise() {
    if (this.noiseData.length === 0) {
      this.averageNoise = 0; // Falls keine Daten vorhanden sind
      return;
    }
  
    const sum = this.noiseData.reduce((acc, val) => acc + val, 0);
    this.averageNoise = sum / this.noiseData.length;
  }
  

  private async saveAverageNoiseWithDate() {
    const date = new Date().toISOString();
    const savedData = {
      date: date,
      averageNoise: this.averageNoise
    };
  
    console.log('Zu speichernde Daten:', savedData);
    await this.storage.set(date, savedData);
    console.log('Gespeicherte Daten:', savedData);
  }
  

  async ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    await StepCounter.stop();
    await NoiseMeter.stop();
  }
}
