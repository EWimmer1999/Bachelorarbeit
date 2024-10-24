import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  darkMode = false;
  noiseData = false;
  stepData = false;

  constructor() { }

  ngOnInit() {
    this.checkMode();
  }

  checkMode() {
    const checkMode = localStorage.getItem('darkModeActivated');
    this.darkMode = checkMode === 'true'; // Setze direkt den Wert
    document.body.classList.toggle('dark', this.darkMode); // Wende die Klasse sofort an
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    localStorage.setItem('darkModeActivated', this.darkMode.toString()); // Verwende toString für einfache Speicherung
  }

  toggleNoiseData() {
    this.noiseData = !this.noiseData;
    localStorage.setItem('noiseDataActivated', this.noiseData.toString());
  }

  toggleStepData() {
    this.stepData = !this.stepData;
    localStorage.setItem('stepDataActivated', this.stepData.toString());
  }
}
