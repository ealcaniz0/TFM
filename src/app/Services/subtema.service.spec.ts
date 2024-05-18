import { TestBed } from '@angular/core/testing';

import { SubtemaService } from './subtema.service';

describe('SubtemaService', () => {
  let service: SubtemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
