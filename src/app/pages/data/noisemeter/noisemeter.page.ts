import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-noisemeter',
  templateUrl: './noisemeter.page.html',
  styleUrls: ['./noisemeter.page.scss'],
})


export class NoisemeterPage implements OnInit {
  savedDataList: Array<{ date: string, averageNoise: number }> = [];
  chartData: number[] = [];  // Typ für chartData als Array von Zahlen
  chartLabels: string[] = [];  // Typ für chartLabels als Array von Strings
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  @ViewChild('lineCanvas', { static: true }) lineCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  constructor(private storage: StorageService) {}

  async ngOnInit() {
    await this.loadSavedData();
    this.prepareChartData();
    Chart.register(...registerables);
    this.createChart();
  }

  createChart() {
    this.chart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Average noisemeter',
            data: this.chartData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {  
              display: true,
              text: 'Datum',
            },
          },
          y: {
            title: {
              display: true,
              text: 'dB',
            },
          },
        },
      },
    });
  }

  private async loadSavedData() {
    const keys = await this.storage.keys();
    this.savedDataList = [];

    for (const key of keys) {
      const data = await this.storage.get(key);
      if (data && data.date && data.averageNoise !== undefined) {
        this.savedDataList.push(data);
      }
    }

    // Sortiere die Daten nach Datum
    this.savedDataList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private prepareChartData() {
    const last7Days = this.savedDataList.slice(-7);
  
    const dailyAverages: { [date: string]: { total: number, count: number } } = {};
  
    for (const data of last7Days) {
      if (!dailyAverages[data.date]) {
        dailyAverages[data.date] = { total: 0, count: 0 };
      }
      dailyAverages[data.date].total += data.averageNoise;
      dailyAverages[data.date].count += 1;
    }
  

    this.chartLabels = Object.keys(dailyAverages).map(date => {
      const parsedDate = new Date(date);
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      return `${day}.${month}`;
    });
  
    this.chartData = this.chartLabels.map((_, index) => {
      const originalDate = Object.keys(dailyAverages)[index];
      return dailyAverages[originalDate].total / dailyAverages[originalDate].count;
    });
  }
  
}