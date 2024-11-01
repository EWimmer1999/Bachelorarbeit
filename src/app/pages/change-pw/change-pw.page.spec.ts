import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePWPage } from './change-pw.page';

describe('ChangePWPage', () => {
  let component: ChangePWPage;
  let fixture: ComponentFixture<ChangePWPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePWPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
