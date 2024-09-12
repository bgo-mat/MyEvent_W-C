import { TestBed } from '@angular/core/testing';

import { WsChatService } from './ws-chat-service';

describe('WsChatServiceService', () => {
  let service: WsChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
