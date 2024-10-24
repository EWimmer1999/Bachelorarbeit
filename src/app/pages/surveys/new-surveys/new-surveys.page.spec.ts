import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewSurveysPage } from './new-surveys.page';

describe('NewSurveysPage', () => {
  let component: NewSurveysPage;
  let fixture: ComponentFixture<NewSurveysPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSurveysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
