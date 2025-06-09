import { TestBed } from '@angular/core/testing';

import { Proceso } from './proceso';

describe('Proceso', () => {
  let service: Proceso;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Proceso);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
