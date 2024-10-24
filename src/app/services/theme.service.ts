// theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode: boolean = false;

  constructor() {
    this.loadTheme();
  }

  loadTheme() {
    const storedTheme = localStorage.getItem('darkModeActivated');
    this.darkMode = storedTheme === 'true';
    this.applyTheme();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkModeActivated', this.darkMode.toString());
    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark', this.darkMode);
  }

  isDarkMode() {
    return this.darkMode;
  }
}
