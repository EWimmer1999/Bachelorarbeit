import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewSurveysPage } from './overview-surveys.page';

describe('OverviewSurveysPage', () => {
  let component: OverviewSurveysPage;
  let fixture: ComponentFixture<OverviewSurveysPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewSurveysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
