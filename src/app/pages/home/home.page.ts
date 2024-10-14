import { Component, OnInit } from '@angular/core';
import {StepCounter} from 'capacitor-stepcounter';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  steps: number = 0;

  constructor() { }

  ngOnInit() {
    this.startStepCounter();
  }

  async startStepCounter() {
    await StepCounter.start();
    this.updateStepCount();
  }

  async updateStepCount() {
    setInterval(async () => {
      const result = await StepCounter.getStepCount();
      this.steps = result.steps;
    }, 1000); // Aktualisiert den Schrittzähler alle 1 Sekunde
  }

  async stopStepCounter() {
    await StepCounter.stop();
  }
}