import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedSurveyDetailPage } from './completed-survey-detail.page';

describe('CompletedSurveyDetailPage', () => {
  let component: CompletedSurveyDetailPage;
  let fixture: ComponentFixture<CompletedSurveyDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedSurveyDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
