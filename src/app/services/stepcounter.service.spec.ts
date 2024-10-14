import { TestBed } from '@angular/core/testing';

import { StepcounterService } from './stepcounter.service';

describe('StepcounterService', () => {
  let service: StepcounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepcounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
