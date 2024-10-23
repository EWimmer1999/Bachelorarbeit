import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiaryEntryDetailPage } from './diary-entry-detail.page';

describe('DiaryEntryDetailPage', () => {
  let component: DiaryEntryDetailPage;
  let fixture: ComponentFixture<DiaryEntryDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiaryEntryDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
