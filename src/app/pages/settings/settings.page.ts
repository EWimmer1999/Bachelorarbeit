import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  darkMode = false;

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

}
