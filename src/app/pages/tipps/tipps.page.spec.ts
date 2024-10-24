import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TippsPage } from './tipps.page';

describe('TippsPage', () => {
  let component: TippsPage;
  let fixture: ComponentFixture<TippsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TippsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
