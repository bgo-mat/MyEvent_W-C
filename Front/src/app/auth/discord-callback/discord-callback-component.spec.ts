import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscordCallbackComponentComponent } from './discord-callback-component';

describe('DiscordCallbackComponentComponent', () => {
  let component: DiscordCallbackComponentComponent;
  let fixture: ComponentFixture<DiscordCallbackComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscordCallbackComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscordCallbackComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
