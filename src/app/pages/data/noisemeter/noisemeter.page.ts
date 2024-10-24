import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StorageService } from 'src/app/services/storage.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-noisemeter',
  templateUrl: './noisemeter.page.html',
  styleUrls: ['./noisemeter.page.scss'],
})
export class NoisemeterPage implements OnInit {
  savedDataList: Array<{ date: string, averageNoise: number }> = [];
  chartData: number[] = [];  // Typ für chartData als Array von Zahlen
  chartLabels: string[] = [];  // Typ für chartLabels als Array von Strings
  todayChartData: number[] = [];  // Daten für das heutige Diagramm
  todayChartLabels: string[] = [];  // Labels für das heutige Diagramm
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  @ViewChild('lineCanvas', { static: true }) lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('todayCanvas', { static: true }) todayCanvas!: ElementRef<HTMLCanvasElement>; // Canvas für das heutige Diagramm
  chart!: Chart;
  todayChart!: Chart;

  constructor(
    private storage: StorageService,
    private themeService: ThemeService
  ) {}

  async ngOnInit() {
    await this.loadSavedData();
    this.prepareChartData();
    await this.prepareGroupedChartData(); // Für das heutige Diagramm
    Chart.register(...registerables);
    this.createCharts();
    this.themeService.applyTheme();
  }

  createCharts() {
    this.chart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Average Noise Levels',
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
              text: 'Date',
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

    // Diagramm für die heutigen Messungen erstellen
    this.todayChart = new Chart(this.todayCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.todayChartLabels,
        datasets: [
          {
            label: 'Today Noise Measurements',
            data: this.todayChartData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
              text: 'Hour',
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
    console.log(keys)
    this.savedDataList = [];

    for (const key of keys) {
      const data = await this.storage.get(key);
      if (data && data.date && data.averageNoise !== undefined) {
        this.savedDataList.push(data);
      }
    }

    this.savedDataList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private prepareChartData() {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date.toISOString().split('T')[0]; 
    }).reverse(); 

    const dailyAverages: { [date: string]: { total: number, count: number } } = {};

    for (const date of last7Days) {
        dailyAverages[date] = { total: 0, count: 0 };
    }

    for (const data of this.savedDataList) {
        const dateKey = data.date.split('T')[0];
        if (dailyAverages[dateKey]) {
            dailyAverages[dateKey].total += data.averageNoise;
            dailyAverages[dateKey].count += 1;
        } else {
           
            dailyAverages[dateKey] = {
                total: data.averageNoise,
                count: 1,
            };
        }
    }

    this.chartLabels = last7Days.map(date => {
      const parsedDate = new Date(date);
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      return `${day}.${month}`; 
    });
  
    this.chartData = this.chartLabels.map(dateLabel => {
      const [day, month] = dateLabel.split('.'); 
      const year = new Date().getFullYear(); 
      const originalDate = `${year}-${month}-${day}`;
      const dayData = dailyAverages[originalDate];
  
      let average = 0; 
      
      if (dayData && dayData.count > 0) {
          average = dayData.total / dayData.count;
      }
      
      return average; 
    });
  
  }

  private async loadAndGroupMeasurements() {
    const today = new Date().toISOString().split('T')[0]; // Aktuelles Datum im YYYY-MM-DD Format
    const groupedMeasurements: { [hour: string]: number[] } = {}; // Objekt zur Speicherung von Werten nach Stunden

    for (const data of this.savedDataList) {
      if (data.date.split('T')[0] === today) { // Überprüfen, ob das Datum heute ist
        const hour = data.date.split('T')[1].split(':')[0]; // Hole die Stunde im HH Format
        if (!groupedMeasurements[hour]) {
          groupedMeasurements[hour] = [];
        }
        groupedMeasurements[hour].push(data.averageNoise); // Füge den Messwert zur entsprechenden Stunde hinzu
      }
    }

    return groupedMeasurements;
  }

  private calculateHourlyAverages(groupedMeasurements: { [hour: string]: number[] }) {
    const hourlyAverages: { hour: string, average: number }[] = [];

    for (const [hour, values] of Object.entries(groupedMeasurements)) {
      const total = values.reduce((sum, value) => sum + value, 0);
      const average = values.length > 0 ? total / values.length : 0;
      hourlyAverages.push({ hour, average });
    }

    return hourlyAverages;
  }

  private async prepareGroupedChartData() {
    const groupedMeasurements = await this.loadAndGroupMeasurements();
    const hourlyAverages = this.calculateHourlyAverages(groupedMeasurements);

    this.todayChartLabels = hourlyAverages.map(data => data.hour + ':00'); // Stunden für die X-Achse
    this.todayChartData = hourlyAverages.map(data => data.average); // Durchschnittswerte für die Y-Achse
  }
}





  
