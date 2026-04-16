import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show and hide loading state', () => {
    expect(service.isLoading()).toBeFalsy();
  });

  it('should show loading state when show() is called', () => {
    service.show();
    expect(service.isLoading()).toBeTruthy();
  });

  it('should hide loading state when hide() is called', () => {
    service.show();
    service.hide();
    expect(service.isLoading()).toBeFalsy();
  });
});
