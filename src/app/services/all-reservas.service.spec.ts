import { TestBed } from '@angular/core/testing';

import { AllReservasService } from './all-reservas.service';

describe('AllReservasService', () => {
  let service: AllReservasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllReservasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
