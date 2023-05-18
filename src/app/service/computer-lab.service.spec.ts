import { TestBed } from '@angular/core/testing';

import { ComputerLabService } from './computer-lab.service';

describe('ComputerLabService', () => {
  let service: ComputerLabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputerLabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
