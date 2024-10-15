import { Component, OnInit, OnDestroy } from '@angular/core';
import { StepCounter } from 'capacitor-stepcounter';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  steps: number = 0; // Variable für die aktuelle Schrittanzahl
  interval: any; // Variable für das Intervall

  constructor() {}

  async ngOnInit() {
    await this.startStepCounter();
    this.updateStepCount(); // Initialer Abruf der Schrittanzahl

    // Setze ein Intervall, um die Schrittanzahl alle 5 Sekunden zu aktualisieren
    this.interval = setInterval(() => {
      this.updateStepCount();
    }, 5000);
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
        const result = await StepCounter.getStepCount(); // Hier sollte ein Objekt mit 'steps' zurückgegeben werden
        this.steps = result.steps; // Aktualisiere die Variable für die Anzeige
    } catch (error) {
        alert('Fehler beim Abrufen der Schrittanzahl: ' + JSON.stringify(error));
    }
  }


  async ngOnDestroy() {
    // Intervall löschen, wenn die Komponente zerstört wird
    if (this.interval) {
      clearInterval(this.interval);
    }
    await StepCounter.stop(); // Schrittzähler stoppen
  }
}