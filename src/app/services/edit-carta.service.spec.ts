import { TestBed } from '@angular/core/testing';

import { EditCartaService } from './edit-carta.service';

describe('EditCartaService', () => {
  let service: EditCartaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditCartaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
