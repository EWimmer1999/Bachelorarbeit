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

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.storage.set('darkModeActivated', this.darkMode.toString());
    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark', this.darkMode);
  }

  isDarkMode() {
    return this.darkMode;
  }
}
