import { TestBed } from '@angular/core/testing';

import { TippsService } from './tipps.service';

describe('TippsService', () => {
  let service: TippsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TippsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
