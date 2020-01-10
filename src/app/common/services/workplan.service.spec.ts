import { TestBed } from '@angular/core/testing';

import { WorkplanService } from './workplan.service';

describe('WorkplanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkplanService = TestBed.get(WorkplanService);
    expect(service).toBeTruthy();
  });
});
