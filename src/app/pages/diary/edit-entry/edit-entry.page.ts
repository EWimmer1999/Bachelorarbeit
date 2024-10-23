import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiaryEntry } from 'src/app/services/data.service';
import { DiaryService } from 'src/app/services/diary.service';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.page.html',
  styleUrls: ['./edit-entry.page.scss'],
})
export class EditEntryPage implements OnInit {
  selectedDate: string = ''; // Datum im ISO-Format
  selectedTime: string = ''; // Uhrzeit im Format 'HH:mm'
  additionalInfo: string = '';
  emotions: string = '';
  activity1: boolean = false;
  activity2: boolean = false;
  activity3: boolean = false;
  stressLevel: number = 1;
  foodCategory: any;
  entryId: number = 1;
  showDatePicker: boolean = false; // für das Datumspopup
  showTimePicker: boolean = false; // für das Zeitpopup

  constructor(
    private diaryService: DiaryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.entryId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEntry();
  }

  async loadEntry() {
    const entry: DiaryEntry | undefined = await this.diaryService.getDiaryEntry(this.entryId);
    if (entry) {
      this.selectedDate = entry.date;
      this.selectedTime = entry.time;
      this.additionalInfo = entry.additionalInfo;
      this.emotions = entry.emotions;
      this.activity1 = entry.activities.happy;
      this.activity2 = entry.activities.excited;
      this.activity3 = entry.activities.sad;
      this.stressLevel = entry.stressLevel;
      this.foodCategory = entry.foodCategory; // Hier wird die foodCategory gesetzt
    }
  }

  openDateCalendar() {
    this.showDatePicker = true; // Zeige das Datumspopup
  }

  closeCalendar() {
    this.showDatePicker = false; // Schließe das Datumspopup
  }

  confirmDateChange() {
    this.closeCalendar(); // Schließe das Datumspopup
  }

  openTimePicker() {
    this.showTimePicker = true; // Zeige das Zeitpopup
  }

  closeTimePicker() {
    this.showTimePicker = false; // Schließe das Zeitpopup
  }

  confirmTimeChange() {
    this.closeTimePicker(); // Schließe das Zeitpopup
  }

  async saveEntry() {
    const updatedEntry: DiaryEntry = {
      id: this.entryId,
      date: this.selectedDate,
      time: this.selectedTime,
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

    console.log(updatedEntry);
    await this.diaryService.updateDiaryEntry(updatedEntry);
    this.router.navigate(['diary']);
  }
}
