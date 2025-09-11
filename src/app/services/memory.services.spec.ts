import { TestBed } from '@angular/core/testing';

import { MemoryServices } from './memory.services';

describe('MemoryServices', () => {
  let service: MemoryServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
