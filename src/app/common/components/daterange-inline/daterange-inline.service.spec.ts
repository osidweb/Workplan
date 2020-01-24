import { TestBed } from '@angular/core/testing';

import { DaterangeInlineService } from './daterange-inline.service';

describe('DaterangeInlineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DaterangeInlineService = TestBed.get(DaterangeInlineService);
    expect(service).toBeTruthy();
  });
});
