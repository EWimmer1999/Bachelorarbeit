import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DiaryEntry } from 'src/app/services/data.service';
import { DiaryService } from 'src/app/services/diary.service';
import { UpdateService } from 'src/app/services/update.service';

@Component({
  selector: 'app-new-diary',
  templateUrl: './new-diary.page.html',
  styleUrls: ['./new-diary.page.scss'],
})
export class NewDiaryPage {
  selectedDate: string = new Date().toISOString(); 
  selectedTime: string = new Date().toISOString();
  showDatePicker: boolean = false;
  showTimePicker: boolean = false;
  tempDate: string = this.selectedDate;
  tempTime: string = this.selectedTime;
  information: string = '';
  notes: string = '';
  activity1: boolean = false;
  activity2: boolean = false;
  activity3: boolean = false;
  stressLevel: number = 1;
  foodCategory: any;

  constructor(private diaryService: DiaryService, private router: Router, private updateService: UpdateService) {}

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
    this.selectedDate = this.tempDate;
    this.closeCalendar();
  }
  
  confirmTimeChange() {
    this.selectedTime = this.tempTime;
    this.closeTimePicker();
  }
  

  async saveEntry() {
    const entry: DiaryEntry = {
      entryId: new Date().getTime(),
      date: this.selectedDate.slice(0,10),
      time: this.selectedTime.slice(11,16),
      foodCategory: this.foodCategory,
      information: this.information,
      notes: this.notes,
      stressLevel: this.stressLevel,
      activities: {
        happy: this.activity1,
        excited: this.activity2,
        sad: this.activity3,
      },
      deleted: false,
    };

    const success = await this.updateService.sendDiary(entry);

    if (success) {
      await this.diaryService.saveDiaryEntry(entry);
    } else {
      await this.diaryService.saveDiaryEntry(entry);
      await this.diaryService.prepareUpload(entry);
    }

    this.router.navigate(['diary']);
  }
}
