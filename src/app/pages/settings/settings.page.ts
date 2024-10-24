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
    checkMode == 'true'
    ? (this.darkMode = true)
    : (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if(this.darkMode) {
      localStorage.setItem('darkModeActivated', 'true');

    }else {
      localStorage.setItem('darkModeActivated', 'false');
    }
  }

  toggleNoiseData(){
    this.noiseData = !this.noiseData;
    if(this.noiseData) {
      localStorage.setItem('noiseDataActivated', 'true');

    }else {
      localStorage.setItem('noiseDataActivated', 'false');
    }
  }

  toggleStepData(){
    this.stepData = !this.stepData;
    if(this.stepData) {
      localStorage.setItem('stepDataActivated', 'true');

    }else {
      localStorage.setItem('stepDataActivated', 'false');
    }
  }

 

}
