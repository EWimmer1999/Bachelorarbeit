import { Component, OnInit } from '@angular/core';
import { DiaryService } from 'src/app/services/diary.service';
import { DiaryEntry } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.page.html',
  styleUrls: ['./diary.page.scss'],
})
export class DiaryPage implements OnInit {
  diaryEntries: DiaryEntry[] = [];
  filteredEntries: DiaryEntry[] = [];
  selectedDate: string = new Date().toISOString().slice(0,10);

  constructor(private diaryService: DiaryService, private router: Router) {}

  async ngOnInit() {
    await this.loadDiaryEntries();
  }

  async loadDiaryEntries() {
    await this.diaryService.loadDiaryEntries();
    this.diaryEntries = this.diaryService.getDiaryEntries(); 
    this.filterEntries(); 
  }

  filterEntries() {
    console.log('All diary entries:', this.diaryEntries);
    this.filteredEntries = this.diaryEntries.filter(
      entry => entry.date === this.selectedDate
    );
    console.log('Filtered entries for date', this.selectedDate, ':', this.filteredEntries);
  }

  changeDate(days: number) {
    const currentDate = new Date(this.selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    this.selectedDate = currentDate.toISOString().slice(0,10);
    this.filterEntries();
  }

  openEntryDetail(entry: DiaryEntry) {
    this.router.navigate(['detail', entry.entryId]);
  }
}

