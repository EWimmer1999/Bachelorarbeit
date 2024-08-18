import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPWPage } from './new-pw.page';

describe('NewPWPage', () => {
  let component: NewPWPage;
  let fixture: ComponentFixture<NewPWPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPWPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
