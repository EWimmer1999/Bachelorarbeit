import { Component, OnInit, OnDestroy } from '@angular/core';
import { StepCounter } from 'capacitor-stepcounter';
import { NoiseMeter } from 'capacitor-noisemeter';
import { StorageService } from 'src/app/services/storage.service';
import { UpdateService } from 'src/app/services/update.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Foregroundservice } from 'capacitor-foregroundservice';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit, OnDestroy {

  public dailySteps: number = 0;
  public totalSteps: number = 0;
  private lastResetDate: string = ''; 
  private startSteps: number = 0;


  steps: number = 0;
  interval: any;
  noiseData: number[] = [];
  averageNoise: number = 0;
  currentDecibels: number = 0;
  noised: boolean = false;

  isMeasuring: boolean = false;

  showButton: boolean = false;

  constructor(
    private storage: StorageService, 
    private updateService: UpdateService,
    private themeService: ThemeService,
    private router: Router,
    private toastController: ToastController
  ) {} 

  async ngOnInit() {
    await Foregroundservice.startService();
    await this.storage.initStorage();
    await this.loadStepData();
    await this.startStepCounter();

    this.interval = setInterval(() => {
      this.updateStepCount();
    }, 5000);
    
    this.updateService.getSettings();
    this.themeService.applyTheme();
    Foregroundservice.startService();
  }

  async updateStepCount() {
    try {
      const result = await StepCounter.getStepCount();
      if (this.startSteps == 0) {
        this.startSteps = result.steps;
      } else{
        this.totalSteps = result.steps - this.startSteps;
      }
    } catch (error) {
      console.log('Fehler beim Abrufen der Schrittanzahl:', error);
    }
  }

  async loadStepData() {
    const savedData = await this.storage.get('steps');
    if (savedData) {
      this.dailySteps = savedData.steps || 0; 
      this.lastResetDate = savedData.date || new Date().toISOString().split('T')[0];
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
        message: message,
        duration: 2000,
        position: 'bottom',
    });
    toast.present();
  }

  async loadDailySteps() {
    const currentDate = new Date().toISOString().split('T')[0]; 
    const savedData = await this.storage.get(currentDate);
    if (savedData) {
      this.dailySteps = savedData.steps;
      this.lastResetDate = currentDate; 
    }
  }

  async ionViewWillEnter(){
    this.themeService.applyTheme();
    this.updateService.updateApp();
    const demographic =await this.storage.get("demographicTag");
    this.showButton = demographic === "false";
  }

  async ionViewDidLeave() {
    if (this.noised) {
      this.stopNoiseMeter()
      this.noised = false;
    }
  }

  async toggleNoiseMeter() {
    if (this.isMeasuring) {
        await this.stopNoiseMeter();
        this.isMeasuring = false;
    } else {
        try {
            await NoiseMeter.start();
            this.isMeasuring = true;
            this.interval = setInterval(() => {
                this.getNoiseLevel();
            }, 1000);
        } catch (error) {
            console.log("Berechtigung zur Audioaufnahme abgelehnt oder Fehler beim Starten:", error);
            this.presentToast("Berechtigung zur Audioaufnahme abgelehnt.");
        }
    }
  }

  async startNoiseMeasure(){
    try {
      await NoiseMeter.start();
      this.interval = setInterval(() => {
        this.getNoiseLevel();
      }, 1000);
      this.noised = true;
    } catch (error) {
      console.log('Fehler beim Starten des NoiseMeters:', error);
    }
  }

  private async startStepCounter() {
    try {
      await StepCounter.start();
    } catch (error) {
      alert('Fehler beim Starten des Schrittzählers: ' + JSON.stringify(error));
    }
  }


  async getNoiseLevel() {
    try {
      const result = await NoiseMeter.getNoiseLevel();
      this.currentDecibels = result.decibels;
  
      // Nur Werte > 0 zur noiseData-Liste hinzufügen
      if (!isNaN(this.currentDecibels) && this.currentDecibels > 0) {
        this.noiseData.push(this.currentDecibels);
      } else {
        console.log('Ungültiger oder zu niedriger Geräuschpegel: ', this.currentDecibels);
      }
    } catch (error) {
      console.log('Fehler beim Abrufen des Geräuschpegels:', error);
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
      alert('Fehler beim Starten des NoiseMeters: ' + JSON.stringify(error));
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
    this.averageNoise = parseFloat((sum / this.noiseData.length).toFixed(2)); 
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
    await StepCounter.stop();
    await NoiseMeter.stop();
  }
}
