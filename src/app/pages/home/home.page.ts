import { Component, OnInit, OnDestroy } from '@angular/core';
import { StepCounter } from 'capacitor-stepcounter';
import { NoiseMeter } from 'capacitor-noisemeter';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  steps: number = 0;
  interval: any;
  noiseData: number[] = []; // Array zur Speicherung der Lautstärkewerte
  averageNoise: number = 0; // Durchschnitt der Lautstärke
  currentDecibels: number = 0;

  constructor() {}

  async ngOnInit() {
    await this.startStepCounter();
    this.updateStepCount();

    // Setze ein Intervall, um die Schrittanzahl alle 5 Sekunden zu aktualisieren
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
      }, 1000); // Jede Sekunde den Wert aktualisieren
    } catch (error) {
      alert('Fehler beim Starten des NoiseMeters: ' + JSON.stringify(error));
    }
  }

  async getNoiseLevel() {
    try {
      const result = await NoiseMeter.getNoiseLevel();
      this.currentDecibels = result.decibels;
    } catch (error) {
      console.log('Fehler beim Abrufen des Geräuschpegels:', error);
    }
  }


  async stopNoiseMeter() {
    try {
      clearInterval(this.interval);
      await NoiseMeter.stop();
    } catch (error) {
      alert('Fehler beim Stoppen des NoiseMeters: ' + JSON.stringify(error));
    }
  }

  
  async ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    await StepCounter.stop();
    await NoiseMeter.stop();
  }
}
