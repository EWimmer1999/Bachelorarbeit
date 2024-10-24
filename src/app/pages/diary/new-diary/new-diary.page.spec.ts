import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDiaryPage } from './new-diary.page';

describe('NewDiaryPage', () => {
  let component: NewDiaryPage;
  let fixture: ComponentFixture<NewDiaryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDiaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
