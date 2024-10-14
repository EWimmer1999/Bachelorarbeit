import { Component, OnInit } from '@angular/core';
import { StepCounterService } from 'src/app/services/stepcounter.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  todayStepCount: number = 0; // Variable für die Schrittanzahl
  totalStepCount: number = 0; // Variable für die Gesamtanzahl der Schritte

  constructor(private stepCounterService: StepCounterService) {}

  ngOnInit() {
    this.getTodayStepCount();
    this.getTotalStepCount();
  }

  getTodayStepCount() {
    this.stepCounterService.getTodayStepCount()
      .then((count: any) => {
        this.todayStepCount = count; // Aktualisiere die Schrittzahl
      })
      .catch((error) => {
        console.error('Error getting today\'s step count:', error);
      });
  }

  getTotalStepCount() {
    this.stepCounterService.getStepCount()
      .then((count: any) => {
        this.totalStepCount = count; // Aktualisiere die Gesamtanzahl der Schritte
      })
      .catch((error) => {
        console.error('Error getting total step count:', error);
      });
  }
}
