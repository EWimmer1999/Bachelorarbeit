import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentSurveysPage } from './current-surveys.page';

describe('CurrentSurveysPage', () => {
  let component: CurrentSurveysPage;
  let fixture: ComponentFixture<CurrentSurveysPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSurveysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
