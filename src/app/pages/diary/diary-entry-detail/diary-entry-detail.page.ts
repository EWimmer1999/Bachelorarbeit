import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiaryService } from 'src/app/services/diary.service';
import { DiaryEntry } from 'src/app/services/data.service';

@Component({
  selector: 'app-diary-entry-detail',
  templateUrl: './diary-entry-detail.page.html',
  styleUrls: ['./diary-entry-detail.page.scss'],
})
export class DiaryEntryDetailPage implements OnInit {
  entry: DiaryEntry | undefined;
  id: number | undefined;
  time: string | undefined;
  formattedTime: any; 
  
  constructor(private route: ActivatedRoute, private diaryService: DiaryService, private router: Router) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.entry = this.diaryService.getDiaryEntries().find(entry => entry.entryId === this.id);
    const [hours, minutes] = this.entry?.time.split(':') || [];
    this.formattedTime = `${hours}:${minutes}`;
  }

  editEntry() {
    this.router.navigate(['edit-entry', this.id])
  }
}
