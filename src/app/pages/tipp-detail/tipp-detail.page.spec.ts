import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TippDetailPage } from './tipp-detail.page';

describe('TippDetailPage', () => {
  let component: TippDetailPage;
  let fixture: ComponentFixture<TippDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TippDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
