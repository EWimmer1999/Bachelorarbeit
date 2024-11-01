import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  darkMode = false;
  noiseData = false;
  stepData = false;
  originalSettings: any = {};

  constructor(
    private storage: StorageService,
    private themeService: ThemeService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.themeService.applyTheme();
    this.loadSettings();
  }

  ionViewWillEnter() {
    this.themeService.applyTheme();
    this.loadSettings();
  }

  async loadSettings(){

    const darkMode = await this.storage.get('darkModeActivated');
    const noiseData = await this.storage.get('noiseDataActivated');
    const stepData = await this.storage.get('stepDataActivated');

    this.darkMode = darkMode === 'true';
    this.noiseData = noiseData === 'true';
    this.stepData = stepData === 'true';

    this.originalSettings = {
      darkMode: this.darkMode,
      noiseData: this.noiseData,
      stepData: this.stepData
    };
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.themeService.toggleDarkMode(this.darkMode);
  }

  toggleNoiseData() {
    this.noiseData = !this.noiseData;
    this.storage.set('noiseDataActivated', this.noiseData.toString());
  }

  toggleStepData() {
    this.stepData = !this.stepData;
    this.storage.set('stepDataActivated', this.stepData.toString());
  }

  async ngOnDestroy() {
    const settingsChanged = this.darkMode !== this.originalSettings.darkMode ||
                            this.noiseData !== this.originalSettings.noiseData ||
                            this.stepData !== this.originalSettings.stepData;

    if (settingsChanged) {
      console.log("Settings changed!")
      const updatedSettings = {
        darkMode: this.darkMode,
        noiseData: this.noiseData,
        stepData: this.stepData
      };

      this.storage.set('settings', updatedSettings);

    }
  }

  navigateProfile(){
    this.navController.navigateBack(['profile']);
  }
}
