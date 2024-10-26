import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemographicPage } from './demographic.page';

describe('DemographicPage', () => {
  let component: DemographicPage;
  let fixture: ComponentFixture<DemographicPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DemographicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
