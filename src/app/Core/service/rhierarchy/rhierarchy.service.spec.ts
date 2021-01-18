import { TestBed } from '@angular/core/testing';

import { RhierarchyService } from './rhierarchy.service';

describe('RhierarchyService', () => {
  let service: RhierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RhierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
