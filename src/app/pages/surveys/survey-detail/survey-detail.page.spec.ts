import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyDetailPage } from './survey-detail.page';

describe('SurveyDetailPage', () => {
  let component: SurveyDetailPage;
  let fixture: ComponentFixture<SurveyDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
