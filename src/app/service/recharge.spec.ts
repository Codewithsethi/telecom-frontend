import { TestBed } from '@angular/core/testing';

import { Recharge } from './recharge';

describe('Recharge', () => {
  let service: Recharge;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Recharge);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
