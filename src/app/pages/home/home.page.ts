import { Component, OnInit, OnDestroy } from '@angular/core';
import { StepCounter } from 'capacitor-stepcounter';
import { NoiseMeter } from 'capacitor-noisemeter';
import { StorageService } from 'src/app/services/storage.service';
import { UpdateService } from 'src/app/services/update.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Foregroundservice } from 'capacitor-foregroundservice';

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
  noised: boolean = false;
  isMeasuring: boolean = false;

  constructor(
    private storage: StorageService,
    private updateService: UpdateService,
    private themeService: ThemeService
  ) {}

  async ngOnInit() {
    try {
      await Foregroundservice.startService();
    } catch (error) {
      console.log('Fehler beim Starten des Foreground Services:', error);
    }

    await this.storage.initStorage();
    await this.startStepCounter();
    this.updateStepCount();

    this.interval = setInterval(() => {
      this.updateStepCount();
    }, 5000);
    
    await this.updateService.getSettings();
    this.themeService.applyTheme();
  }

  ionViewWillEnter() {
    this.themeService.applyTheme();
    this.updateService.updateApp();
  }

  async ionViewDidLeave() {
    if (this.noised) {
      await this.stopNoiseMeter();
      this.noised = false;
    }
  }

  async testForeground() {
    try {
      await Foregroundservice.startService();
    } catch (error) {
      console.log('Fehler beim Testen des Foreground Services:', error);
    }
  }



  async toggleNoiseMeter() {
    if (this.isMeasuring) {
      await this.stopNoiseMeter();
    } else {
      await this.startNoiseMeter();
    }
    this.isMeasuring = !this.isMeasuring;
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
      console.log('Fehler beim Abrufen der Schrittanzahl:', error);
    }
  }

  async startNoiseMeter() {
    try {
      await NoiseMeter.startRecording();
      this.interval = setInterval(() => {
        this.getNoiseLevel();
      }, 1000);
      this.noised = true;
    } catch (error) {
      console.log('Fehler beim Starten des NoiseMeters:', error);
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
      this.noised = false;
    } catch (error) {
      console.log('Fehler beim Stoppen des NoiseMeters:', error);
    }
  }

  private calculateAverageNoise() {
    if (this.noiseData.length === 0) {
      this.averageNoise = 0;
      return;
    }

    const sum = this.noiseData.reduce((acc, val) => acc + val, 0);
    this.averageNoise = sum / this.noiseData.length;
  }

  private async saveAverageNoiseWithDate() {
    const date = new Date().toISOString();
    const savedData = {
      date: date,
      averageNoise: this.averageNoise,
    };

    console.log('Zu speichernde Daten:', savedData);
    await this.storage.set(date, savedData);
    console.log('Gespeicherte Daten:', savedData);
  }

  async ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    try {
      await StepCounter.stop();
      await NoiseMeter.stop();
    } catch (error) {
      console.log('Fehler beim Zerstören:', error);
    }
  }
}
