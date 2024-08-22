import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedSurveysPage } from './completed-surveys.page';

describe('CompletedSurveysPage', () => {
  let component: CompletedSurveysPage;
  let fixture: ComponentFixture<CompletedSurveysPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedSurveysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
