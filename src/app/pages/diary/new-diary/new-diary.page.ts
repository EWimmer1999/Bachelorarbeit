import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DiaryEntry } from 'src/app/services/data.service';
import { DiaryService } from 'src/app/services/diary.service';

@Component({
  selector: 'app-new-diary',
  templateUrl: './new-diary.page.html',
  styleUrls: ['./new-diary.page.scss'],
})
export class NewDiaryPage {
  selectedDate: Date = new Date() 
  selectedTime: Date = new Date()
  showDatePicker: boolean = false;
  showTimePicker: boolean = false;
  tempDate: string = this.selectedDate.toISOString();
  tempTime: string = this.selectedTime.toISOString();
  additionalInfo: string = '';
  emotions: string = '';
  activity1: boolean = false;
  activity2: boolean = false;
  activity3: boolean = false;
  stressLevel: number = 1;
  foodCategory: any;

  constructor(private diaryService: DiaryService, private router: Router) {}

  openDateCalendar() {
    this.showDatePicker = true;
  }

  openTimePicker() {
    this.showTimePicker = true;
  }

  closeCalendar() {
    this.showDatePicker = false;
  }

  closeTimePicker() {
    this.showTimePicker = false;
  }

  confirmDateChange() {
    this.selectedDate = new Date(this.tempDate); // Setze das ausgewählte Datum
    this.closeCalendar();
  }
  
  confirmTimeChange() {
    this.selectedTime = new Date(this.tempTime); // Setze die ausgewählte Zeit
    this.closeTimePicker();
  }
  

  async saveEntry() {
    const formattedDate = this.selectedDate;
    const entry: DiaryEntry = {
      id: new Date().getTime(),
      date: this.selectedDate.toDateString(),
      time: this.selectedTime.toString(),
      foodCategory: this.foodCategory,
      additionalInfo: this.additionalInfo,
      emotions: this.emotions,
      stressLevel: this.stressLevel,
      activities: {
        happy: this.activity1,
        excited: this.activity2,
        sad: this.activity3,
      },
    };

    await this.diaryService.saveDiaryEntry(entry);
    console.log('Tagebucheintrag gespeichert:', entry);
    this.router.navigate(['diary']);
  }
}
