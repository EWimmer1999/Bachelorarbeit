// theme.service.ts
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode: boolean = false;

  constructor(private storage: StorageService) {
    this.loadTheme();
  }

  async loadTheme() {
    const storedTheme = await this.storage.get('darkModeActivated');
    this.darkMode = storedTheme === "true";
    this.applyTheme();
  }

  toggleDarkMode(isDarkMode: boolean) {
    document.body.classList.toggle('dark', isDarkMode);
    this.storage.set('darkModeActivated', isDarkMode.toString());
  }

  async applyTheme() {
    console.log("Theme applied!")
    const darkModeActivated = await this.storage.get('darkModeActivated');
    const isDarkMode = darkModeActivated === 'true';
    document.body.classList.toggle('dark', isDarkMode);
  }

  isDarkMode() {
    return this.darkMode;
  }
}
