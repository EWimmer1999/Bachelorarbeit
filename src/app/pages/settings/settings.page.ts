import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  darkMode = false;
  noiseData = false;
  stepData = false;

  constructor(
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.checkMode();
  }

  async checkMode() {
    const checkMode = await this.storage.get('darkModeActivated');
    this.darkMode = checkMode === "true";
    document.body.classList.toggle('dark', this.darkMode);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    this.storage.set('darkModeActivated', this.darkMode.toString()); // Verwende toString für einfache Speicherung
  }

  toggleNoiseData() {
    this.noiseData = !this.noiseData;
    this.storage.set('noiseDataActivated', this.noiseData.toString());
  }

  toggleStepData() {
    this.stepData = !this.stepData;
    this.storage.set('stepDataActivated', this.stepData.toString());
  }
}
